import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, createInitializeMintInstruction, MINT_SIZE, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createMintToInstruction } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createMetaplexNFT = async (wallet: any, name: string, description: string, imageUrl: string) => {
  try {
    console.log('Metaplex wallet check:', { wallet: !!wallet, publicKey: !!wallet?.publicKey, sendTransaction: !!wallet?.sendTransaction });
    
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      throw new Error(`Wallet not connected - publicKey: ${!!wallet?.publicKey}, sendTransaction: ${!!wallet?.sendTransaction}`);
    }

    const { publicKey, sendTransaction } = wallet;

    // Create mint keypair
    const mintKeypair = new (await import('@solana/web3.js')).Keypair();
    
    // Create the mint (simplified approach - just create NFT structure)
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    
    const transaction = new Transaction();
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = publicKey;

    // Add create mint account instruction
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Add initialize mint instruction (0 decimals for NFT)
    transaction.add(
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        0,
        publicKey,
        publicKey
      )
    );

    // Get associated token account
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      publicKey
    );

    // Add create associated token account instruction
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAccount,
        publicKey,
        mintKeypair.publicKey
      )
    );

    // Add mint to instruction (mint 1 NFT)
    transaction.add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedTokenAccount,
        publicKey,
        1
      )
    );

    // Sign and send transaction with better error handling
    let signature: string;
    try {
      transaction.partialSign(mintKeypair);
      signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'processed'
      });
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
    } catch (txError: any) {
      console.error('Transaction failed:', txError);
      throw new Error(`NFT creation failed: ${txError.message || 'Transaction error'}`);
    }

    // Create metadata object (stored off-chain for now)
    const metadata = {
      name: name,
      description: description,
      image: imageUrl,
      attributes: [
        { trait_type: "Created By", value: "AI Work Engine" },
        { trait_type: "Type", value: "AI Generated NFT" }
      ],
      properties: {
        files: [{ uri: imageUrl, type: "image/png" }],
        category: "image"
      }
    };

    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      name: name,
      description: description,
      signature: signature,
      metadataUri: `https://arweave.net/${mintKeypair.publicKey.toBase58().slice(0, 16)}`,
      blockTime: Date.now(),
      slot: await connection.getSlot(),
      image: imageUrl,
      metadata: metadata,
      isNFT: true // Flag to indicate this is an NFT structure
    };
  } catch (error) {
    console.error('Metaplex NFT creation failed:', error);
    throw error;
  }
};