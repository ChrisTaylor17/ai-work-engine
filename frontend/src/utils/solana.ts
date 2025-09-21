import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createWorkToken = async (wallet: any, amount: number) => {
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    // Create new SPL token mint
    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      9 // 9 decimals
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
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

    const { nft } = await metaplex.nfts().create({
      uri: '',
      name: name,
      description: description,
      image: imageUrl,
      sellerFeeBasisPoints: 500, // 5% royalty
    });

    return {
      mintAddress: nft.address.toBase58(),
      name: name,
      description: description,
      signature: nft.mint.signature,
      metadataUri: nft.uri,
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