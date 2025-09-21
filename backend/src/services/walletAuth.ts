import jwt from 'jsonwebtoken';
import { PublicKey } from '@solana/web3.js';
import { UserModel } from '../models/user';

export interface WalletAuthResult {
  token: string;
  user: any;
}

export class WalletAuthService {
  private jwtSecret = process.env.JWT_SECRET || 'default-secret';

  async connectWallet(walletAddress: string, signature: string): Promise<WalletAuthResult> {
    // Validate Solana wallet address
    try {
      new PublicKey(walletAddress);
    } catch {
      throw new Error('Invalid wallet address');
    }

    // TODO: Verify signature in production
    // For now, accept any signature for development
    if (!signature) {
      throw new Error('Signature required');
    }

    // Find or create user
    let user = await UserModel.findByWallet(walletAddress);
    
    if (!user) {
      user = await UserModel.create({
        walletAddress,
        publicKey: walletAddress
      });
    } else {
      // Update online status
      user = await UserModel.update(user.id, {
        isOnline: true,
        lastSeen: new Date()
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        walletAddress: user.walletAddress 
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return { token, user };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      const user = await UserModel.findByWallet(decoded.walletAddress);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  extractTokenFromHeader(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }
    return authHeader.substring(7);
  }
}