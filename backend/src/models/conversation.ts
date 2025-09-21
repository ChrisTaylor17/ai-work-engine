import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateConversationData {
  userId?: string;
  projectId?: string;
  message: string;
  role: 'user' | 'assistant' | 'system';
}

export class ConversationModel {
  static async create(data: CreateConversationData) {
    return prisma.conversation.create({
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

  static async findByUser(userId: string, limit = 50) {
    return prisma.conversation.findMany({
      where: { userId },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  static async findByProject(projectId: string, limit = 50) {
    return prisma.conversation.findMany({
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
      },
      take: limit
    });
  }

  static async findGlobal(limit = 50) {
    return prisma.conversation.findMany({
      where: {
        projectId: null
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }
}