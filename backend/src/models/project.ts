import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProjectData {
  name: string;
  description: string;
  tokenMintAddress: string;
  tokenSymbol: string;
  totalSupply: bigint;
}

export interface UpdateProjectData {
  status?: string;
  completedAt?: Date;
  tokenMintAddress?: string;
}

export class ProjectModel {
  static async create(data: CreateProjectData) {
    return prisma.project.create({
      data,
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        },
        tokenAllocations: true
      }
    });
  }

  static async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        },
        contributions: true,
        tokenAllocations: true
      }
    });
  }

  static async findByUserId(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
            isActive: true
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        },
        tokenAllocations: true
      }
    });
  }

  static async update(id: string, data: UpdateProjectData) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }
}