const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Work Engine API' });
});

// Mock auth endpoint
app.post('/api/auth/wallet', (req, res) => {
  console.log('Auth request received:', req.body);
  const { walletAddress, signature } = req.body;
  
  if (!walletAddress || !signature) {
    console.log('Missing wallet address or signature');
    return res.status(400).json({ error: 'Wallet address and signature required' });
  }
  
  console.log('Processing auth for wallet:', walletAddress);

  // Mock user data
  const user = {
    id: 'user_' + Date.now(),
    walletAddress,
    publicKey: walletAddress,
    isOnline: true,
    lastSeen: new Date(),
    profile: null
  };

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, walletAddress },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  console.log('Auth successful for:', walletAddress);
  res.json({ token, user });
});

// Mock verify endpoint
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = {
      id: decoded.userId,
      walletAddress: decoded.walletAddress,
      publicKey: decoded.walletAddress,
      isOnline: true,
      profile: null
    };
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});