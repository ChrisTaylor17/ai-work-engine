import { PrismaClient } from '@prisma/client';
import { ContributionService } from '../../src/services/contributionService';
import { AIAgentService } from '../../src/services/aiAgent';
import { TokenManagerService } from '../../src/services/tokenManager';

const prisma = new PrismaClient();

describe('Work Contribution Flow Integration', () => {
  beforeEach(async () => {
    await prisma.workContribution.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should complete full contribution evaluation and token allocation', async () => {
    // Create test user and project
    const user = await prisma.user.create({
      data: {
        walletAddress: 'contributor-wallet',
        publicKey: 'contributor-key'
      }
    });

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'Test project for contributions',
        tokenMintAddress: 'mock-mint-address',
        tokenSymbol: 'TEST',
        totalSupply: BigInt(1000000)
      }
    });

    // Submit contribution
    const contributionService = new ContributionService();
    const contribution = await contributionService.submitContribution({
      userId: user.id,
      projectId: project.id,
      description: 'Completed trading interface mockups',
      evidence: 'https://figma.com/mockups'
    });

    expect(contribution).toHaveProperty('id');
    expect(contribution.description).toBe('Completed trading interface mockups');

    // AI evaluation
    const aiService = new AIAgentService();
    const evaluation = await aiService.evaluateContribution(contribution.id);

    expect(evaluation).toHaveProperty('score');
    expect(evaluation).toHaveProperty('tokenReward');
    expect(evaluation).toHaveProperty('reasoning');
    expect(evaluation.score).toBeGreaterThanOrEqual(0);
    expect(evaluation.score).toBeLessThanOrEqual(1);

    // Verify contribution updated with evaluation
    const updatedContribution = await prisma.workContribution.findUnique({
      where: { id: contribution.id }
    });
    expect(updatedContribution?.aiScore).toBe(evaluation.score);
    expect(updatedContribution?.tokenReward).toBe(BigInt(evaluation.tokenReward));

    // Verify token allocation recorded
    const allocation = await prisma.tokenAllocation.findFirst({
      where: {
        projectId: project.id,
        userId: user.id,
        allocationType: 'contribution'
      }
    });
    expect(allocation).toBeTruthy();
    expect(allocation?.amount).toBe(BigInt(evaluation.tokenReward));
  });
});