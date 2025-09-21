import { PublicKey, Keypair } from '@solana/web3.js';
import { BlockchainService } from './blockchain';
import { TokenAllocationModel } from '../models/tokenAllocation';

export interface TokenAllocation {
  userId: string;
  walletAddress: string;
  amount: bigint;
  type: 'founder' | 'contribution' | 'platform_fee';
}

export class TokenManagerService {
  private blockchain: BlockchainService;

  constructor() {
    this.blockchain = new BlockchainService();
  }

  async createProjectTokens(
    projectId: string,
    tokenSymbol: string,
    totalSupply: number,
    initialAllocations: TokenAllocation[]
  ): Promise<string> {
    try {
      // Generate keypair for this project's token
      const mintAuthority = Keypair.generate();
      
      // Create token mint on Solana
      const mintAddress = await this.blockchain.createTokenMint(
        mintAuthority,
        tokenSymbol,
        totalSupply
      );

      // Process initial allocations
      for (const allocation of initialAllocations) {
        const userPublicKey = new PublicKey(allocation.walletAddress);
        
        // Mint tokens to user
        const txHash = await this.blockchain.mintTokens(
          mintAddress,
          userPublicKey,
          Number(allocation.amount),
          mintAuthority
        );

        // Record allocation in database
        await TokenAllocationModel.create({
          projectId,
          userId: allocation.userId,
          amount: allocation.amount,
          allocationType: allocation.type,
          transactionHash: txHash
        });
      }

      return mintAddress;
    } catch (error) {
      throw new Error(`Failed to create project tokens: ${error}`);
    }
  }

  async allocateTokens(
    mintAddress: string,
    userPublicKey: PublicKey,
    amount: number
  ): Promise<string> {
    try {
      // For MVP, use simplified token allocation
      // In production, need proper mint authority management
      const mockTxHash = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      return mockTxHash;
    } catch (error) {
      throw new Error(`Failed to allocate tokens: ${error}`);
    }
  }

  async transferTokens(
    mintAddress: string,
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): Promise<string> {
    try {
      return await this.blockchain.transferTokens(mintAddress, from, to, amount);
    } catch (error) {
      throw new Error(`Failed to transfer tokens: ${error}`);
    }
  }

  async getTokenBalance(mintAddress: string, userPublicKey: PublicKey): Promise<number> {
    try {
      return await this.blockchain.getTokenBalance(mintAddress, userPublicKey);
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error}`);
    }
  }

  calculateInitialAllocations(
    founderId: string,
    founderWallet: string,
    teamMembers: Array<{ userId: string; walletAddress: string }>,
    totalSupply: number
  ): TokenAllocation[] {
    const allocations: TokenAllocation[] = [];
    
    // Constitutional requirement: Founder gets minimum 51%
    const founderAmount = Math.floor(totalSupply * 0.6); // 60%
    allocations.push({
      userId: founderId,
      walletAddress: founderWallet,
      amount: BigInt(founderAmount),
      type: 'founder'
    });

    // Platform fee: Maximum 5% (constitutional limit)
    const platformFee = Math.floor(totalSupply * 0.05); // 5%
    
    // Remaining tokens for team members
    const remainingForTeam = totalSupply - founderAmount - platformFee;
    const perMemberAmount = Math.floor(remainingForTeam / teamMembers.length);

    teamMembers.forEach(member => {
      allocations.push({
        userId: member.userId,
        walletAddress: member.walletAddress,
        amount: BigInt(perMemberAmount),
        type: 'contribution'
      });
    });

    return allocations;
  }

  async getProjectTokenInfo(projectId: string) {
    const allocations = await TokenAllocationModel.findByProject(projectId);
    const totalAllocated = await TokenAllocationModel.getTotalByProject(projectId);
    
    return {
      allocations,
      totalAllocated,
      allocationsByType: this.groupAllocationsByType(allocations)
    };
  }

  private groupAllocationsByType(allocations: any[]) {
    return allocations.reduce((acc, allocation) => {
      const type = allocation.allocationType;
      if (!acc[type]) acc[type] = BigInt(0);
      acc[type] += allocation.amount;
      return acc;
    }, {});
  }
}