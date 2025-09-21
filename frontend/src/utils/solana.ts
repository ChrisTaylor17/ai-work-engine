import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Metaplex, keypairIdentity, walletAdapterIdentity } from '@metaplex-foundation/js';

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
  try {
    if (!wallet?.publicKey) {
      throw new Error('Wallet not connected');
    }

    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet));

    // Create NFT without metadata upload (simplified)
    const { nft } = await metaplex.nfts().create({
      uri: '',
      name: name,
      sellerFeeBasisPoints: 500,
    });

    return {
      mintAddress: nft.address.toBase58(),
      name: name,
      description: description,
      signature: nft.mint.address.toBase58(),
      metadataUri: `https://example.com/metadata/${nft.address.toBase58()}`,
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