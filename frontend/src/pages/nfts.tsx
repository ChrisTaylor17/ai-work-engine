import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createRealNFT } from '../utils/nft';

interface NFT {
  mint: string;
  name: string;
  image: string;
  description: string;
  attributes?: Array<{trait_type: string, value: string}>;
  creator: string;
  timestamp: number;
}

export default function NFTs() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [creating, setCreating] = useState(false);
  const [newNFT, setNewNFT] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    setMounted(true);
    loadNFTs();
  }, []);

  const loadNFTs = () => {
    // Load from localStorage (in production, fetch from blockchain)
    const saved = localStorage.getItem('consilience_nfts');
    if (saved) {
      setNfts(JSON.parse(saved));
    }
  };

  const saveNFTs = (updatedNFTs: NFT[]) => {
    localStorage.setItem('consilience_nfts', JSON.stringify(updatedNFTs));
    setNfts(updatedNFTs);
  };

  const createNFT = async () => {
    if (!connected || !publicKey || !newNFT.name.trim()) return;
    
    setCreating(true);
    
    try {
      // Generate image if not provided
      const imageUrl = newNFT.imageUrl || `https://picsum.photos/800/800?random=${Date.now()}`;
      
      // Create real NFT on Solana
      const nftData = await createRealNFT(
        { publicKey, sendTransaction },
        newNFT.name,
        newNFT.description,
        imageUrl
      );

      const nft: NFT = {
        mint: nftData.mintAddress,
        name: newNFT.name,
        image: imageUrl,
        description: newNFT.description,
        creator: publicKey.toBase58().slice(0, 8),
        timestamp: Date.now(),
        attributes: [
          { trait_type: 'Creator', value: publicKey.toBase58().slice(0, 8) },
          { trait_type: 'Platform', value: 'CONSILIENCE' },
          { trait_type: 'Type', value: 'Productivity NFT' }
        ]
      };

      const updatedNFTs = [nft, ...nfts];
      saveNFTs(updatedNFTs);
      
      setNewNFT({ name: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('NFT creation failed:', error);
      alert('NFT creation failed. Make sure you have SOL for transaction fees.');
    }
    
    setCreating(false);
  };

  const generateRandomImage = () => {
    const randomId = Date.now();
    setNewNFT(prev => ({
      ...prev,
      imageUrl: `https://picsum.photos/800/800?random=${randomId}`
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <span className="text-black font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider">CONSILIENCE</h1>
          </div>
          
          {mounted && (
            <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !font-medium !text-sm !px-4 !py-2" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex space-x-8">
          <Link href="/" className="text-gray-400 hover:text-white font-medium">Chat</Link>
          <Link href="/connect" className="text-gray-400 hover:text-white font-medium">Connect</Link>
          <Link href="/portfolio" className="text-gray-400 hover:text-white font-medium">Portfolio</Link>
          <Link href="/goals" className="text-gray-400 hover:text-white font-medium">Goals</Link>
          <Link href="/wallet" className="text-gray-400 hover:text-white font-medium">Wallet</Link>
          <Link href="/nfts" className="text-white border-b-2 border-white pb-1 font-medium">NFTs</Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Create NFT */}
        {connected && (
          <div className="border border-white p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Create NFT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">NFT Name</label>
                <input
                  type="text"
                  value={newNFT.name}
                  onChange={(e) => setNewNFT(prev => ({...prev, name: e.target.value}))}
                  placeholder="My Awesome NFT"
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={newNFT.description}
                  onChange={(e) => setNewNFT(prev => ({...prev, description: e.target.value}))}
                  placeholder="A unique digital asset representing..."
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNFT.imageUrl}
                    onChange={(e) => setNewNFT(prev => ({...prev, imageUrl: e.target.value}))}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={generateRandomImage}
                    className="border border-white hover:bg-white hover:text-black px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
            
            {newNFT.imageUrl && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Preview</label>
                <img 
                  src={newNFT.imageUrl} 
                  alt="NFT Preview"
                  className="w-32 h-32 object-cover border border-white"
                />
              </div>
            )}
            
            <button
              onClick={createNFT}
              disabled={creating || !newNFT.name.trim()}
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-6 py-2 font-medium"
            >
              {creating ? 'Creating NFT...' : 'Create NFT on Solana'}
            </button>
          </div>
        )}

        {/* NFT Gallery */}
        <div>
          <h2 className="text-xl font-bold mb-6">Your NFTs</h2>
          {nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map(nft => (
                <div key={nft.mint} className="border border-white">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{nft.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{nft.description}</p>
                    
                    {nft.attributes && (
                      <div className="mb-3">
                        <div className="text-xs font-medium mb-2">Attributes</div>
                        <div className="flex flex-wrap gap-2">
                          {nft.attributes.map((attr, index) => (
                            <span key={index} className="border border-white px-2 py-1 text-xs">
                              {attr.trait_type}: {attr.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <div>Creator: {nft.creator}</div>
                      <div>Created: {new Date(nft.timestamp).toLocaleDateString()}</div>
                      <div className="break-all">Mint: {nft.mint}</div>
                    </div>
                    
                    <a
                      href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-300 text-xs underline"
                    >
                      View on Solana Explorer →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white">
              <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
                <span className="text-black font-bold text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold mb-4">No NFTs Yet</h3>
              <p className="text-gray-400 mb-6">
                {connected 
                  ? "Create your first NFT above or say 'create nft' in the chat"
                  : "Connect your wallet to view and create NFTs"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}