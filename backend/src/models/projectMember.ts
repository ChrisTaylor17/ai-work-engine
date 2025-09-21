import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProjectMemberData {
  userId: string;
  projectId: string;
  role: 'founder' | 'contributor';
}

export interface UpdateProjectMemberData {
  isActive?: boolean;
  leftAt?: Date;
}

export class ProjectMemberModel {
  static async create(data: CreateProjectMemberData) {
    return prisma.projectMember.create({
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

  static async createMany(members: CreateProjectMemberData[]) {
    return prisma.projectMember.createMany({
      data: members
    });
  }

  static async findByProject(projectId: string) {
    return prisma.projectMember.findMany({
      where: { 
        projectId,
        isActive: true
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  static async findByUser(userId: string) {
    return prisma.projectMember.findMany({
      where: { 
        userId,
        isActive: true
      },
      include: {
        project: true
      }
    });
  }

  static async update(userId: string, projectId: string, data: UpdateProjectMemberData) {
    return prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      },
      data,
      include: {
        user: true,
        project: true
      }
    });
  }
}