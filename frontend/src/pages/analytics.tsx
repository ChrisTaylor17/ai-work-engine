import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mockData = {
    productivity: {
      goalsCompleted: 12,
      tokensEarned: 2450,
      connectionsMode: 8,
      nftsCreated: 3
    },
    network: {
      totalConnections: 24,
      activeConversations: 6,
      introductionsMade: 15,
      collaborationsStarted: 4
    },
    blockchain: {
      totalTransactions: 18,
      nftsMinted: 3,
      tokensTransferred: 1200,
      walletValue: 3.2
    }
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
          <Link href="/nfts" className="text-gray-400 hover:text-white font-medium">NFTs</Link>
          <Link href="/analytics" className="text-white border-b-2 border-white pb-1 font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!connected ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
              <span className="text-black font-bold text-xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">
              View your productivity analytics and blockchain activity
            </p>
          </div>
        ) : (
          <>
            {/* Timeframe Selector */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <div className="flex space-x-2">
                {['7d', '30d', '90d', '1y'].map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-4 py-2 text-sm font-medium ${
                      timeframe === period 
                        ? 'bg-white text-black' 
                        : 'border border-white text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Productivity Metrics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Productivity</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.productivity.goalsCompleted}</div>
                  <div className="text-gray-400 text-sm">Goals Completed</div>
                  <div className="text-green-400 text-xs mt-1">+3 this week</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.productivity.tokensEarned}</div>
                  <div className="text-gray-400 text-sm">Tokens Earned</div>
                  <div className="text-green-400 text-xs mt-1">+450 this week</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.productivity.connectionsMode}</div>
                  <div className="text-gray-400 text-sm">New Connections</div>
                  <div className="text-green-400 text-xs mt-1">+2 this week</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.productivity.nftsCreated}</div>
                  <div className="text-gray-400 text-sm">NFTs Created</div>
                  <div className="text-green-400 text-xs mt-1">+1 this week</div>
                </div>
              </div>
            </div>

            {/* Network Metrics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Network Growth</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.network.totalConnections}</div>
                  <div className="text-gray-400 text-sm">Total Connections</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.network.activeConversations}</div>
                  <div className="text-gray-400 text-sm">Active Conversations</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.network.introductionsMade}</div>
                  <div className="text-gray-400 text-sm">Introductions Made</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.network.collaborationsStarted}</div>
                  <div className="text-gray-400 text-sm">Collaborations Started</div>
                </div>
              </div>
            </div>

            {/* Blockchain Activity */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Blockchain Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.blockchain.totalTransactions}</div>
                  <div className="text-gray-400 text-sm">Total Transactions</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.blockchain.nftsMinted}</div>
                  <div className="text-gray-400 text-sm">NFTs Minted</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.blockchain.tokensTransferred}</div>
                  <div className="text-gray-400 text-sm">Tokens Transferred</div>
                </div>
                <div className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{mockData.blockchain.walletValue} SOL</div>
                  <div className="text-gray-400 text-sm">Wallet Value</div>
                </div>
              </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">Activity Over Time</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <div>Activity chart visualization</div>
                  <div className="text-sm mt-2">Shows productivity trends, network growth, and token earnings</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}