import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { corsConfig } from './lib/cors';
import { requestLogger } from './lib/logger';
import { errorHandler } from './lib/errorHandler';
import { connectDatabase } from './lib/database';
import { validateSolanaConnection } from './lib/solana';

// Import API routes
import authRoutes from './api/auth';
import projectRoutes from './api/projects';
import aiRoutes from './api/ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(corsConfig);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get('/health', (req: any, res: any) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use('*', (req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 AI Work Engine Backend running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
    
    // Initialize database (non-blocking)
    connectDatabase().catch(err => {
      console.warn('Database connection failed:', err.message);
    });
    
    // Validate Solana connection (non-blocking)
    validateSolanaConnection().catch(err => {
      console.warn('Solana connection failed:', err.message);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

export { app };