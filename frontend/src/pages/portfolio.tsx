import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';

interface NFT {
  mint: string;
  name: string;
  image: string;
  description: string;
}

interface Token {
  mint: string;
  symbol: string;
  balance: number;
  decimals: number;
}

export default function Portfolio() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      loadPortfolio();
    }
  }, [connected, publicKey]);

  const loadPortfolio = async () => {
    if (!publicKey) return;
    setLoading(true);

    try {
      // Mock NFT data (in production, fetch from Solana)
      const mockNFTs: NFT[] = [
        {
          mint: 'ABC123...',
          name: 'CONSILIENCE Genesis',
          image: 'https://picsum.photos/400/400?random=1',
          description: 'First NFT in the CONSILIENCE ecosystem'
        },
        {
          mint: 'DEF456...',
          name: 'Productivity Badge',
          image: 'https://picsum.photos/400/400?random=2',
          description: 'Earned for completing 10 goals'
        },
        {
          mint: 'GHI789...',
          name: 'Connection Master',
          image: 'https://picsum.photos/400/400?random=3',
          description: 'Awarded for making 5 meaningful connections'
        }
      ];

      // Mock token data
      const mockTokens: Token[] = [
        {
          mint: 'CONSILIENCE',
          symbol: 'CNSL',
          balance: 1250,
          decimals: 2
        },
        {
          mint: 'SOL',
          symbol: 'SOL',
          balance: 2.5,
          decimals: 9
        }
      ];

      setNfts(mockNFTs);
      setTokens(mockTokens);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }

    setLoading(false);
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
          <Link href="/portfolio" className="text-white border-b-2 border-white pb-1 font-medium">Portfolio</Link>
          <Link href="/goals" className="text-gray-400 hover:text-white font-medium">Goals</Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!connected ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">
              View your NFTs, tokens, and blockchain achievements
            </p>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="border border-white p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Wallet Overview</h2>
              <div className="text-gray-400 text-sm mb-4">
                {publicKey?.toBase58()}
              </div>
              
              {/* Tokens */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tokens.map(token => (
                  <div key={token.mint} className="border border-white p-4">
                    <div className="font-bold text-lg">{token.balance}</div>
                    <div className="text-gray-400 text-sm">{token.symbol}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* NFTs */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6">Your NFTs</h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">Loading NFTs...</div>
                </div>
              ) : (
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
                        <div className="text-xs text-gray-500">
                          {nft.mint}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {nfts.length === 0 && !loading && (
                <div className="text-center py-12 border border-white">
                  <div className="text-gray-400 mb-4">No NFTs found</div>
                  <div className="text-sm text-gray-500">
                    Create your first NFT in the chat or complete goals to earn achievement NFTs
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="border border-white p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div>
                    <div className="font-medium">Earned CONSILIENCE tokens</div>
                    <div className="text-gray-400 text-sm">Chat participation</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">+50 CNSL</div>
                    <div className="text-gray-400 text-xs">2 hours ago</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <div>
                    <div className="font-medium">Minted NFT</div>
                    <div className="text-gray-400 text-sm">Connection Master badge</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">NFT</div>
                    <div className="text-gray-400 text-xs">1 day ago</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">Goal completed</div>
                    <div className="text-gray-400 text-sm">Connect with 5 people</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">+100 CNSL</div>
                    <div className="text-gray-400 text-xs">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}