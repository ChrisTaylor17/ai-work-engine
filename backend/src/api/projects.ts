import { Router, Request, Response } from 'express';
import { ProjectModel } from '../models/project';
import { ProjectMemberModel } from '../models/projectMember';
import { WorkContributionModel } from '../models/workContribution';
import { TokenAllocationModel } from '../models/tokenAllocation';
import { MatchingService } from '../services/matching';
import { TokenManagerService } from '../services/tokenManager';
import { authMiddleware } from '../lib/auth';

const router = Router();
const matchingService = new MatchingService();
const tokenManager = new TokenManagerService();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/projects
router.post('/', async (req: Request, res: Response) => {
  try {
    const { description, requiredSkills = [], teamSize = 3 } = req.body;
    const userId = (req as any).user.id;
    const userWallet = (req as any).user.walletAddress;

    if (!description) {
      return res.status(400).json({ error: 'Project description required' });
    }

    // Find matching team members
    const matchResult = await matchingService.findMatches(userId, description, {
      requiredSkills,
      teamSize
    });

    if (matchResult.matches.length < teamSize - 1) {
      return res.status(400).json({ error: 'Insufficient available users for team formation' });
    }

    // Create project
    const tokenSymbol = `PRJ${Date.now().toString().slice(-6)}`;
    const totalSupply = 1000000; // 1M tokens

    const project = await ProjectModel.create({
      name: description.substring(0, 50),
      description,
      tokenMintAddress: 'pending', // Will update after token creation
      tokenSymbol,
      totalSupply: BigInt(totalSupply)
    });

    // Create project members
    const members = [
      { userId, projectId: project.id, role: 'founder' as const },
      ...matchResult.matches.map(match => ({
        userId: match.userId,
        projectId: project.id,
        role: 'contributor' as const
      }))
    ];

    await ProjectMemberModel.createMany(members);

    // Calculate token allocations
    const allocations = tokenManager.calculateInitialAllocations(
      userId,
      userWallet,
      matchResult.matches.map(m => ({ userId: m.userId, walletAddress: m.walletAddress })),
      totalSupply
    );

    // Create tokens on blockchain
    const mintAddress = await tokenManager.createProjectTokens(
      project.id,
      tokenSymbol,
      totalSupply,
      allocations
    );

    // Update project with mint address
    const updatedProject = await ProjectModel.update(project.id, {
      tokenMintAddress: mintAddress
    });

    res.status(201).json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Project creation failed' });
  }
});

// GET /api/projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const projects = await ProjectModel.findByUserId(userId);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id/tokens
router.get('/:id/tokens', async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const project = await ProjectModel.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tokenInfo = await tokenManager.getProjectTokenInfo(projectId);
    
    res.json({
      mintAddress: project.tokenMintAddress,
      symbol: project.tokenSymbol,
      totalSupply: project.totalSupply.toString(),
      userBalance: '0', // TODO: Get actual user balance
      allocations: tokenInfo.allocations.map(a => ({
        userId: a.userId,
        amount: a.amount.toString(),
        type: a.allocationType
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch token info' });
  }
});

// POST /api/projects/:id/contributions
router.post('/:id/contributions', async (req: Request, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { description, evidence } = req.body;
    const userId = (req as any).user.id;

    if (!description) {
      return res.status(400).json({ error: 'Contribution description required' });
    }

    const contribution = await WorkContributionModel.create({
      userId,
      projectId,
      description
    });

    res.status(201).json(contribution);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to submit contribution' });
  }
});

export default router;