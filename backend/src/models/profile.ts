import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProfileData {
  userId: string;
  displayName?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  experience?: string;
  availability?: string;
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  experience?: string;
  availability?: string;
}

export class ProfileModel {
  static async create(data: CreateProfileData) {
    return prisma.profile.create({
      data,
      include: {
        user: true
      }
    });
  }

  static async findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });
  }

  static async update(userId: string, data: UpdateProfileData) {
    return prisma.profile.update({
      where: { userId },
      data,
      include: {
        user: true
      }
    });
  }

  static async upsert(userId: string, data: CreateProfileData) {
    return prisma.profile.upsert({
      where: { userId },
      create: data,
      update: data,
      include: {
        user: true
      }
    });
  }
}