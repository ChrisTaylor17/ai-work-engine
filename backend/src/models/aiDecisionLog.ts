import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAIDecisionLogData {
  decisionType: 'matching' | 'allocation' | 'evaluation';
  context: any;
  result: any;
  ipfsHash?: string;
  blockchainTx?: string;
}

export class AIDecisionLogModel {
  static async create(data: CreateAIDecisionLogData) {
    return prisma.aIDecisionLog.create({
      data
    });
  }

  static async findById(id: string) {
    return prisma.aIDecisionLog.findUnique({
      where: { id }
    });
  }

  static async findByType(decisionType: string, limit = 100) {
    return prisma.aIDecisionLog.findMany({
      where: { decisionType },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  static async findRecent(limit = 50) {
    return prisma.aIDecisionLog.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
  }

  static async updateIpfsHash(id: string, ipfsHash: string) {
    return prisma.aIDecisionLog.update({
      where: { id },
      data: { ipfsHash }
    });
  }

  static async updateBlockchainTx(id: string, blockchainTx: string) {
    return prisma.aIDecisionLog.update({
      where: { id },
      data: { blockchainTx }
    });
  }
}