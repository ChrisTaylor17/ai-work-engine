import { Connection, Keypair } from '@solana/web3.js';
import { BlockchainService } from '../../src/services/blockchain';
import { TokenManagerService } from '../../src/services/tokenManager';

describe('Token Operations Integration', () => {
  let connection: Connection;
  let blockchainService: BlockchainService;
  let tokenManager: TokenManagerService;

  beforeAll(() => {
    connection = new Connection('http://localhost:8899', 'confirmed');
    blockchainService = new BlockchainService();
    tokenManager = new TokenManagerService();
  });

  it('should create SPL token and allocate to users', async () => {
    const projectKeypair = Keypair.generate();
    const userKeypairs = [Keypair.generate(), Keypair.generate()];
    
    // Create token mint
    const mintAddress = await blockchainService.createTokenMint(
      projectKeypair,
      'TEST',
      1000000 // 1M tokens with 6 decimals
    );
    
    expect(mintAddress).toBeTruthy();
    
    // Allocate tokens to users
    const allocations = [
      { userPublicKey: userKeypairs[0].publicKey, amount: 600000 }, // 60%
      { userPublicKey: userKeypairs[1].publicKey, amount: 350000 }, // 35%
    ];
    
    for (const allocation of allocations) {
      const txHash = await tokenManager.allocateTokens(
        mintAddress,
        allocation.userPublicKey,
        allocation.amount
      );
      expect(txHash).toBeTruthy();
    }
    
    // Verify balances
    const balance1 = await tokenManager.getTokenBalance(
      mintAddress,
      userKeypairs[0].publicKey
    );
    const balance2 = await tokenManager.getTokenBalance(
      mintAddress,
      userKeypairs[1].publicKey
    );
    
    expect(balance1).toBe(600000);
    expect(balance2).toBe(350000);
  });

  it('should handle token transfer between users', async () => {
    const mintAddress = 'mock-mint-address';
    const fromKeypair = Keypair.generate();
    const toKeypair = Keypair.generate();
    
    const txHash = await tokenManager.transferTokens(
      mintAddress,
      fromKeypair.publicKey,
      toKeypair.publicKey,
      100000
    );
    
    expect(txHash).toBeTruthy();
  });
});