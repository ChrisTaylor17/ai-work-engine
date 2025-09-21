import { Router, Request, Response } from 'express';
import { AIAgentService } from '../services/aiAgent';
import { authMiddleware } from '../lib/auth';

const router = Router();
const aiAgent = new AIAgentService();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/ai/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, projectId } = req.body;
    const userId = (req as any).user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const response = await aiAgent.chat(userId, message, projectId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'AI chat failed' });
  }
});

// POST /api/ai/match
router.post('/match', async (req: Request, res: Response) => {
  try {
    const { projectDescription, requiredSkills = [], teamSize = 3 } = req.body;
    const userId = (req as any).user.id;

    if (!projectDescription) {
      return res.status(400).json({ error: 'Project description required' });
    }

    const result = await aiAgent.matchUsers(
      projectDescription,
      requiredSkills,
      teamSize,
      [userId] // Exclude the requesting user
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'User matching failed' });
  }
});

// POST /api/ai/evaluate
router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { contributionId, context } = req.body;

    if (!contributionId) {
      return res.status(400).json({ error: 'Contribution ID required' });
    }

    const result = await aiAgent.evaluateContribution(contributionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Contribution evaluation failed' });
  }
});

export default router;