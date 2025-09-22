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

  // Skip complex metadata for now - just create NFT structure

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