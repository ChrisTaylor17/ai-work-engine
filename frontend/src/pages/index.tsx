import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import WalletConnect from '../components/WalletConnect';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/ai/project-creator');
    }
  }, []);

  const handleWalletConnect = async (walletAddress: string, signature: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ai-work-engine-production.up.railway.app';
      const response = await fetch(`${apiUrl}/api/auth/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress,
          signature
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        
        // Check if user has profile
        if (!data.user.profile) {
          router.push('/profile');
        } else {
          router.push('/ai/project-creator');
        }
      } else {
        alert('Authentication failed: ' + data.error);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed');
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-16">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 retro-glow">
                  AI Work Engine
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Connect. Collaborate. Create. Earn.
                </p>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Join the future of work where AI matches you with perfect teammates, 
                  manages project tokens, and rewards your contributions on the blockchain.
                </p>
              </div>

              <div className="max-w-md mx-auto card">
                <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                  Connect Your Wallet
                </h2>
                <WalletConnect onConnect={handleWalletConnect} />
              </div>

              <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    🤖
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">AI Matching</h3>
                  <p className="text-gray-300">
                    Our AI finds the perfect teammates based on skills, interests, and availability.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    ⛓️
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Blockchain Tokens</h3>
                  <p className="text-gray-300">
                    Earn project equity through SPL tokens that represent your contributions.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    🚀
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Fair Rewards</h3>
                  <p className="text-gray-300">
                    AI evaluates your work and allocates tokens transparently and fairly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}