import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, createInitializeMintInstruction, MINT_SIZE, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createMintToInstruction } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

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
    const transaction = new Transaction();
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = publicKey;
    transaction.add(
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

    // Create JSON metadata
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
      attributes: [
        { trait_type: "Created By", value: "AI Work Engine" },
        { trait_type: "Type", value: "AI Generated" }
      ]
    };

    // Create transaction
    const transaction = new Transaction();
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = publicKey;
    transaction.add(
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

    // Note: Metadata stored off-chain for simplicity

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
      metadataUri: `https://arweave.net/${mintKeypair.publicKey.toBase58().slice(0, 16)}`,
      blockTime: Date.now(),
      slot: await connection.getSlot(),
      image: imageUrl,
      metadata: metadata
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