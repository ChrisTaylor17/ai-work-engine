import { PrismaClient } from '@prisma/client';
import { Connection, Keypair } from '@solana/web3.js';
import { WalletAuthService } from '../../src/services/walletAuth';

const prisma = new PrismaClient();

describe('Wallet Authentication Integration', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should complete full wallet connection flow', async () => {
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toString();
    
    // Mock signature verification
    const authService = new WalletAuthService();
    const result = await authService.connectWallet(walletAddress, 'mock-signature');
    
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.walletAddress).toBe(walletAddress);
    
    // Verify user created in database
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });
    expect(user).toBeTruthy();
    expect(user?.isOnline).toBe(true);
  });

  it('should handle returning user', async () => {
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toString();
    
    // Create existing user
    await prisma.user.create({
      data: {
        walletAddress,
        publicKey: walletAddress,
        isOnline: false
      }
    });
    
    const authService = new WalletAuthService();
    const result = await authService.connectWallet(walletAddress, 'mock-signature');
    
    expect(result.user.walletAddress).toBe(walletAddress);
    
    // Verify user status updated
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });
    expect(user?.isOnline).toBe(true);
  });
});