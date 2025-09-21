import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createWorkToken = async (walletAdapter: any, amount: number) => {
  try {
    if (!walletAdapter?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const publicKey = walletAdapter.publicKey;

    // Create new SPL token mint - user pays fees
    const mint = await createMint(
      connection,
      walletAdapter,
      publicKey,
      null,
      9
    );

    // Get or create token account - user pays fees
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletAdapter,
      mint,
      publicKey
    );

    // Mint tokens to user - user pays fees
    const signature = await mintTo(
      connection,
      walletAdapter,
      mint,
      tokenAccount.address,
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature);

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

export const createNFT = async (walletAdapter: any, name: string, description: string, imageUrl: string) => {
  try {
    if (!walletAdapter?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const publicKey = walletAdapter.publicKey;

    // Create NFT using SPL token with supply of 1 - user pays fees
    const mint = await createMint(
      connection,
      walletAdapter,
      publicKey,
      publicKey,
      0 // 0 decimals for NFT
    );

    // Get or create token account - user pays fees
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletAdapter,
      mint,
      publicKey
    );

    // Mint 1 NFT to user - user pays fees
    const signature = await mintTo(
      connection,
      walletAdapter,
      mint,
      tokenAccount.address,
      publicKey,
      1
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return {
      mintAddress: mint.toBase58(),
      name: name,
      description: description,
      signature: signature,
      metadataUri: `https://example.com/metadata/${mint.toBase58()}`,
      blockTime: Date.now(),
      slot: await connection.getSlot(),
      image: imageUrl
    };
  } catch (error) {
    console.error('NFT creation failed:', error);
    throw error;
  }
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