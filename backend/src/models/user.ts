import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserData {
  walletAddress: string;
  publicKey: string;
}

export interface UpdateUserData {
  isOnline?: boolean;
  lastSeen?: Date;
}

export class UserModel {
  static async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        ...data,
        isOnline: true,
        lastSeen: new Date()
      },
      include: {
        profile: true
      }
    });
  }

  static async findByWallet(walletAddress: string) {
    return prisma.user.findUnique({
      where: { walletAddress },
      include: {
        profile: true,
        projectMembers: {
          include: {
            project: true
          }
        }
      }
    });
  }

  static async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true
      }
    });
  }

  static async findAvailable(excludeIds: string[] = []) {
    return prisma.user.findMany({
      where: {
        isOnline: true,
        id: { notIn: excludeIds },
        profile: {
          availability: 'available'
        }
      },
      include: {
        profile: true
      }
    });
  }
}