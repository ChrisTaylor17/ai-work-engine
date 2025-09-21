import { Request, Response, NextFunction } from 'express';
import { WalletAuthService } from '../services/walletAuth';

const walletAuth = new WalletAuthService();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = walletAuth.extractTokenFromHeader(authHeader);
    const user = await walletAuth.verifyToken(token);
    
    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : 'Authentication failed' });
  }
}