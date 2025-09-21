import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, createInitializeMintInstruction, MINT_SIZE, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createMintToInstruction } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createWorkToken = async (wallet: any, amount: number) => {
  try {
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      throw new Error('Wallet not connected');
    }

    const { publicKey, sendTransaction } = wallet;

    // Create mint account
    const mintKeypair = new (await import('@solana/web3.js')).Keypair();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        publicKey,
        null
      )
    );

    // Get associated token account
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      publicKey
    );

    // Add create ATA instruction
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAccount,
        publicKey,
        mintKeypair.publicKey
      )
    );

    // Add mint instruction
    transaction.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAccount,
        publicKey,
        amount * LAMPORTS_PER_SOL
      )
    );

    // Send transaction
    transaction.partialSign(mintKeypair);
    const signature = await sendTransaction(transaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      tokenAccount: associatedTokenAccount.toBase58(),
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
  try {
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      throw new Error('Wallet not connected');
    }

    const { publicKey, sendTransaction } = wallet;

    // Create mint account for NFT
    const mintKeypair = new (await import('@solana/web3.js')).Keypair();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        0, // 0 decimals for NFT
        publicKey,
        publicKey
      )
    );

    // Get associated token account
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      publicKey
    );

    // Add create ATA instruction
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAccount,
        publicKey,
        mintKeypair.publicKey
      )
    );

    // Add mint instruction (mint 1 NFT)
    transaction.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAccount,
        publicKey,
        1
      )
    );

    // Send transaction
    transaction.partialSign(mintKeypair);
    const signature = await sendTransaction(transaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      name: name,
      description: description,
      signature: signature,
      metadataUri: `https://example.com/metadata/${mintKeypair.publicKey.toBase58()}`,
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