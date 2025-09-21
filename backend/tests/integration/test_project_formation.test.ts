import { PrismaClient } from '@prisma/client';
import { ProjectService } from '../../src/services/projectService';
import { AIAgentService } from '../../src/services/aiAgent';
import { BlockchainService } from '../../src/services/blockchain';

const prisma = new PrismaClient();

describe('Project Formation Integration', () => {
  beforeEach(async () => {
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create project with AI matching and token deployment', async () => {
    // Create test users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          walletAddress: 'user1-wallet',
          publicKey: 'user1-key',
          isOnline: true,
          profile: {
            create: {
              skills: ['JavaScript', 'Solana'],
              interests: ['DeFi', 'Trading'],
              availability: 'available'
            }
          }
        }
      }),
      prisma.user.create({
        data: {
          walletAddress: 'user2-wallet',
          publicKey: 'user2-key',
          isOnline: true,
          profile: {
            create: {
              skills: ['React', 'UI/UX'],
              interests: ['Frontend', 'Design'],
              availability: 'available'
            }
          }
        }
      })
    ]);

    const projectService = new ProjectService();
    const project = await projectService.createProject({
      founderId: users[0].id,
      description: 'Build a DeFi trading bot',
      requiredSkills: ['JavaScript', 'React'],
      teamSize: 2
    });

    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('tokenMintAddress');
    expect(project.members).toHaveLength(2);
    
    // Verify token allocations created
    const allocations = await prisma.tokenAllocation.findMany({
      where: { projectId: project.id }
    });
    expect(allocations.length).toBeGreaterThan(0);
    
    // Verify founder has majority allocation
    const founderAllocation = allocations.find(a => a.userId === users[0].id);
    expect(founderAllocation).toBeTruthy();
    expect(Number(founderAllocation?.amount)).toBeGreaterThan(500); // >50% of 1000 tokens
  });
});