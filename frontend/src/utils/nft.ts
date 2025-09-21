import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createInitializeMintInstruction, MINT_SIZE, getMinimumBalanceForRentExemptMint, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createMintToInstruction } from '@solana/spl-token';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const createRealNFT = async (wallet: any, name: string, description: string, imageUrl: string) => {
  if (!wallet?.publicKey || !wallet?.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  const { publicKey, sendTransaction } = wallet;
  const mintKeypair = new (await import('@solana/web3.js')).Keypair();
  
  // Create metadata PDA
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );

  const lamports = await getMinimumBalanceForRentExemptMint(connection);
  const associatedTokenAccount = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);

  const transaction = new Transaction();
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = publicKey;

  // Create mint account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    })
  );

  // Initialize mint (0 decimals for NFT)
  transaction.add(
    createInitializeMintInstruction(mintKeypair.publicKey, 0, publicKey, publicKey)
  );

  // Create associated token account
  transaction.add(
    createAssociatedTokenAccountInstruction(publicKey, associatedTokenAccount, publicKey, mintKeypair.publicKey)
  );

  // Mint 1 token
  transaction.add(
    createMintToInstruction(mintKeypair.publicKey, associatedTokenAccount, publicKey, 1)
  );

  // Add metadata instruction
  const metadataData = Buffer.concat([
    Buffer.from([33]), // CreateMetadataAccountV3
    Buffer.from([name.length, 0, 0, 0]), Buffer.from(name, 'utf8'),
    Buffer.from(['CNFT'.length, 0, 0, 0]), Buffer.from('CNFT', 'utf8'),
    Buffer.from([description.length, 0, 0, 0]), Buffer.from(description, 'utf8'),
    Buffer.from([imageUrl.length, 0, 0, 0]), Buffer.from(imageUrl, 'utf8'),
    Buffer.from([0, 0]), // seller_fee_basis_points
    Buffer.from([1]), // update_authority_is_signer
    Buffer.from([1]), // is_mutable
  ]);

  transaction.add(
    new TransactionInstruction({
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
      data: metadataData,
    })
  );

  transaction.partialSign(mintKeypair);
  const signature = await sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  return {
    mintAddress: mintKeypair.publicKey.toBase58(),
    name,
    description,
    signature,
    image: imageUrl,
    metadataPDA: metadataPDA.toBase58(),
  };
};