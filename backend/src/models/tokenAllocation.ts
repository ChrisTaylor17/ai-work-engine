import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTokenAllocationData {
  projectId: string;
  userId: string;
  amount: bigint;
  allocationType: 'founder' | 'contribution' | 'platform_fee';
  transactionHash?: string;
}

export class TokenAllocationModel {
  static async create(data: CreateTokenAllocationData) {
    return prisma.tokenAllocation.create({
      data,
      include: {
        project: true
      }
    });
  }

  static async createMany(allocations: CreateTokenAllocationData[]) {
    return prisma.tokenAllocation.createMany({
      data: allocations
    });
  }

  static async findByProject(projectId: string) {
    return prisma.tokenAllocation.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findByUser(userId: string) {
    return prisma.tokenAllocation.findMany({
      where: { userId },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getTotalByUser(projectId: string, userId: string) {
    const result = await prisma.tokenAllocation.aggregate({
      where: {
        projectId,
        userId
      },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || BigInt(0);
  }

  static async getTotalByProject(projectId: string) {
    const result = await prisma.tokenAllocation.aggregate({
      where: { projectId },
      _sum: {
        amount: true
      }
    });
    return result._sum.amount || BigInt(0);
  }
}