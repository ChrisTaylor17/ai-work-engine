import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID, createInitializeMintInstruction, MINT_SIZE, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createMintToInstruction } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Metaplex Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const createMetaplexNFT = async (wallet: any, name: string, description: string, imageUrl: string) => {
  try {
    if (!wallet?.publicKey || !wallet?.sendTransaction) {
      throw new Error('Wallet not connected');
    }

    const { publicKey, sendTransaction } = wallet;

    // Create mint keypair
    const mintKeypair = new (await import('@solana/web3.js')).Keypair();
    
    // Create metadata JSON
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

    // Upload metadata to a simple storage (for demo, we'll use a mock URI)
    const metadataUri = `https://arweave.net/${mintKeypair.publicKey.toBase58().slice(0, 16)}`;

    // Find metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Create the mint
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

    // Create metadata instruction using raw instruction data
    const createMetadataInstruction = {
      keys: [
        { pubkey: metadataPDA, isSigner: false, isWritable: true },
        { pubkey: mintKeypair.publicKey, isSigner: false, isWritable: false },
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: publicKey, isSigner: true, isWritable: true },
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: new PublicKey('Sysvar1nstructions1111111111111111111111111'), isSigner: false, isWritable: false },
      ],
      programId: TOKEN_METADATA_PROGRAM_ID,
      data: createMetadataInstructionData(name, 'AINFT', description, metadataUri)
    };

    transaction.add(createMetadataInstruction);

    // Sign and send transaction
    transaction.partialSign(mintKeypair);
    const signature = await sendTransaction(transaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);

    return {
      mintAddress: mintKeypair.publicKey.toBase58(),
      name: name,
      description: description,
      signature: signature,
      metadataUri: metadataUri,
      blockTime: Date.now(),
      slot: await connection.getSlot(),
      image: imageUrl,
      metadataPDA: metadataPDA.toBase58(),
      metadata: metadata
    };
  } catch (error) {
    console.error('Metaplex NFT creation failed:', error);
    throw error;
  }
};

// Helper function to create metadata instruction data
function createMetadataInstructionData(name: string, symbol: string, description: string, uri: string): Buffer {
  // This is a simplified version - real implementation would need proper borsh serialization
  const nameBytes = Buffer.from(name, 'utf8');
  const symbolBytes = Buffer.from(symbol, 'utf8');
  const descBytes = Buffer.from(description, 'utf8');
  const uriBytes = Buffer.from(uri, 'utf8');
  
  return Buffer.concat([
    Buffer.from([33]), // CreateMetadataAccountV3 discriminator
    Buffer.from([nameBytes.length, 0, 0, 0]), // name length (u32 little endian)
    nameBytes,
    Buffer.from([symbolBytes.length, 0, 0, 0]), // symbol length
    symbolBytes,
    Buffer.from([uriBytes.length, 0, 0, 0]), // uri length
    uriBytes,
    Buffer.from([0, 0]), // seller_fee_basis_points (u16)
    Buffer.from([1]), // update_authority_is_signer
    Buffer.from([1]), // is_mutable
    Buffer.from([0]), // collection (none)
    Buffer.from([0]), // uses (none)
  ]);
}