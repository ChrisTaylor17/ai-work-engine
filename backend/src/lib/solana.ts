import { Connection, clusterApiUrl } from '@solana/web3.js';

export const solanaConfig = {
  network: process.env.NODE_ENV === 'production' ? 'mainnet-beta' : 'devnet',
  rpcUrl: process.env.SOLANA_RPC_URL || (
    process.env.NODE_ENV === 'production' 
      ? clusterApiUrl('mainnet-beta')
      : 'http://localhost:8899' // Local test validator
  )
};

export function createSolanaConnection(): Connection {
  return new Connection(solanaConfig.rpcUrl, 'confirmed');
}

export async function validateSolanaConnection(): Promise<boolean> {
  try {
    const connection = createSolanaConnection();
    const version = await connection.getVersion();
    console.log('Solana connection validated:', version);
    return true;
  } catch (error) {
    console.error('Solana connection failed:', error);
    return false;
  }
}