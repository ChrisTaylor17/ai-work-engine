import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// CONSILIENCE Token mint address (create once, reuse)
let CONSILIENCE_MINT: PublicKey | null = null;

export const createConsilienceToken = async (wallet: any) => {
  if (!wallet?.publicKey || !wallet?.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Create CONSILIENCE token mint (only once)
    if (!CONSILIENCE_MINT) {
      const mintKeypair = new (await import('@solana/web3.js')).Keypair();
      
      const mint = await createMint(
        connection,
        wallet,
        wallet.publicKey,
        wallet.publicKey,
        2, // 2 decimals for CONSILIENCE tokens
        mintKeypair
      );
      
      CONSILIENCE_MINT = mint;
    }

    return CONSILIENCE_MINT;
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
};

export const rewardUser = async (wallet: any, amount: number, reason: string) => {
  if (!wallet?.publicKey || !CONSILIENCE_MINT) return null;

  try {
    // Get or create user's token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      CONSILIENCE_MINT,
      wallet.publicKey
    );

    // Mint tokens to user
    const signature = await mintTo(
      connection,
      wallet,
      CONSILIENCE_MINT,
      tokenAccount.address,
      wallet.publicKey,
      amount * 100 // Convert to token units (2 decimals)
    );

    return {
      signature,
      amount,
      reason,
      tokenAccount: tokenAccount.address.toBase58(),
      mint: CONSILIENCE_MINT.toBase58()
    };
  } catch (error) {
    console.error('Token reward failed:', error);
    return null;
  }
};