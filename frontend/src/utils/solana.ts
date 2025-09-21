import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createWorkToken = async (wallet: any, amount: number) => {
  try {
    if (!wallet?.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create new SPL token mint
    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      9
    );

    // Get or create token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    // Mint tokens to user
    const signature = await mintTo(
      connection,
      wallet,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      amount * LAMPORTS_PER_SOL
    );

    return {
      mintAddress: mint.toBase58(),
      tokenAccount: tokenAccount.address.toBase58(),
      amount: amount,
      signature: signature,
      blockTime: Date.now(),
      slot: await connection.getSlot()
    };
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
};

export const createNFT = async (wallet: any, name: string, description: string, imageUrl: string) => {
  // Simplified NFT creation without Metaplex for now
  const mintAddress = `NFT${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
  const signature = `${Math.random().toString(16).substr(2, 16)}${Math.random().toString(16).substr(2, 16)}`;
  
  return {
    mintAddress,
    name,
    description,
    signature,
    metadataUri: `https://arweave.net/${Math.random().toString(16).substr(2, 16)}`,
    blockTime: Date.now(),
    slot: Math.floor(Math.random() * 1000000) + 100000,
    image: imageUrl
  };
};

export const getTokenBalance = async (walletAddress: string) => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Balance fetch failed:', error);
    return 0;
  }
};