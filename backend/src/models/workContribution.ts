import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateWorkContributionData {
  userId: string;
  projectId: string;
  description: string;
}

export interface UpdateWorkContributionData {
  aiScore?: number;
  tokenReward?: bigint;
  evaluatedAt?: Date;
}

export class WorkContributionModel {
  static async create(data: CreateWorkContributionData) {
    return prisma.workContribution.create({
      data,
      include: {
        user: {
          include: {
            profile: true
          }
        },
        project: true
      }
    });
  }

  static async findById(id: string) {
    return prisma.workContribution.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        project: true
      }
    });
  }

  static async findByProject(projectId: string) {
    return prisma.workContribution.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findByUser(userId: string) {
    return prisma.workContribution.findMany({
      where: { userId },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async update(id: string, data: UpdateWorkContributionData) {
    return prisma.workContribution.update({
      where: { id },
      data,
      include: {
        user: true,
        project: true
      }
    });
  }
}