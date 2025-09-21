import { Router, Request, Response } from 'express';
import { WalletAuthService } from '../services/walletAuth';

const router = Router();
const walletAuth = new WalletAuthService();

// POST /api/auth/wallet
router.post('/wallet', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature required' });
    }

    const result = await walletAuth.connectWallet(walletAddress, signature);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : 'Authentication failed' });
  }
});

// GET /api/auth/verify
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = walletAuth.extractTokenFromHeader(authHeader);
    const user = await walletAuth.verifyToken(token);
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid token' });
  }
});

export default router;