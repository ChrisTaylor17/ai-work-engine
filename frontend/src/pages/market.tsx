import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

export default function Market() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setMounted(true);
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      // Mock data (in production, fetch from CoinGecko or similar)
      const mockData: TokenData[] = [
        {
          symbol: 'SOL',
          name: 'Solana',
          price: 23.45,
          change24h: 5.67,
          volume: 1234567890,
          marketCap: 9876543210
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          price: 1.00,
          change24h: 0.01,
          volume: 2345678901,
          marketCap: 28765432109
        },
        {
          symbol: 'RAY',
          name: 'Raydium',
          price: 0.234,
          change24h: -2.34,
          volume: 12345678,
          marketCap: 123456789
        },
        {
          symbol: 'ORCA',
          name: 'Orca',
          price: 0.567,
          change24h: 8.91,
          volume: 23456789,
          marketCap: 234567890
        },
        {
          symbol: 'MNGO',
          name: 'Mango',
          price: 0.012,
          change24h: -5.67,
          volume: 3456789,
          marketCap: 34567890
        }
      ];
      
      setTokens(mockData);
    } catch (error) {
      console.error('Failed to load market data:', error);
    }
    setLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold rounded">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold">CONSILIENCE</h1>
              <p className="text-sm text-gray-600">Crypto Market Data</p>
            </div>
          </div>
          
          {mounted && (
            <WalletMultiButton className="!bg-black !text-white hover:!bg-gray-800 !rounded-lg !text-sm" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-black font-medium">Dashboard</Link>
          <Link href="/portfolio" className="text-gray-600 hover:text-black font-medium">Portfolio</Link>
          <Link href="/goals" className="text-gray-600 hover:text-black font-medium">Goals</Link>
          <Link href="/wallet" className="text-gray-600 hover:text-black font-medium">Wallet</Link>
          <Link href="/nfts" className="text-gray-600 hover:text-black font-medium">NFTs</Link>
          <Link href="/market" className="text-black border-b-2 border-black pb-1 font-medium">Market</Link>
          <Link href="/analytics" className="text-gray-600 hover:text-black font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Solana Token Market</h2>
            <p className="text-gray-600">Real-time prices and market data</p>
          </div>
          <button
            onClick={loadMarketData}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">$23.45</div>
            <div className="text-sm text-gray-600">SOL Price</div>
            <div className="text-xs text-green-600 mt-1">+5.67% (24h)</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">$1.2B</div>
            <div className="text-sm text-gray-600">24h Volume</div>
            <div className="text-xs text-gray-600 mt-1">Across all tokens</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">$9.8B</div>
            <div className="text-sm text-gray-600">SOL Market Cap</div>
            <div className="text-xs text-gray-600 mt-1">Rank #9</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-600">Active Tokens</div>
            <div className="text-xs text-gray-600 mt-1">On Solana</div>
          </div>
        </div>

        {/* Token Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold">Top Solana Tokens</h3>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-2xl mb-2">📊</div>
              <div>Loading market data...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tokens.map((token, index) => (
                    <tr key={token.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold rounded mr-3">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{token.symbol}</div>
                            <div className="text-sm text-gray-500">{token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${token.price.toFixed(token.price < 1 ? 4 : 2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${formatNumber(token.volume)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${formatNumber(token.marketCap)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Market Analysis */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Market Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">Bullish Sentiment</div>
                  <div className="text-sm text-green-600">SOL ecosystem growing</div>
                </div>
                <div className="text-2xl">📈</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-800">DeFi Activity</div>
                  <div className="text-sm text-blue-600">High trading volume</div>
                </div>
                <div className="text-2xl">🔄</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium text-purple-800">NFT Market</div>
                  <div className="text-sm text-purple-600">Steady growth</div>
                </div>
                <div className="text-2xl">🎨</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Value Locked</span>
                <span className="font-bold">$2.1B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Validators</span>
                <span className="font-bold">1,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transactions/sec</span>
                <span className="font-bold">2,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network Fee</span>
                <span className="font-bold">$0.00025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}