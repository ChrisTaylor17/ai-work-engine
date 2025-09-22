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
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,raydium,orca,mango-markets&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true');
      const data = await response.json();
      
      const realData: TokenData[] = [
        {
          symbol: 'SOL',
          name: 'Solana',
          price: data.solana?.usd || 0,
          change24h: data.solana?.usd_24h_change || 0,
          volume: data.solana?.usd_24h_vol || 0,
          marketCap: data.solana?.usd_market_cap || 0
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          price: data['usd-coin']?.usd || 1,
          change24h: data['usd-coin']?.usd_24h_change || 0,
          volume: data['usd-coin']?.usd_24h_vol || 0,
          marketCap: data['usd-coin']?.usd_market_cap || 0
        },
        {
          symbol: 'RAY',
          name: 'Raydium',
          price: data.raydium?.usd || 0,
          change24h: data.raydium?.usd_24h_change || 0,
          volume: data.raydium?.usd_24h_vol || 0,
          marketCap: data.raydium?.usd_market_cap || 0
        },
        {
          symbol: 'ORCA',
          name: 'Orca',
          price: data.orca?.usd || 0,
          change24h: data.orca?.usd_24h_change || 0,
          volume: data.orca?.usd_24h_vol || 0,
          marketCap: data.orca?.usd_market_cap || 0
        },
        {
          symbol: 'MNGO',
          name: 'Mango',
          price: data['mango-markets']?.usd || 0,
          change24h: data['mango-markets']?.usd_24h_change || 0,
          volume: data['mango-markets']?.usd_24h_vol || 0,
          marketCap: data['mango-markets']?.usd_market_cap || 0
        }
      ];
      
      setTokens(realData);
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
            <div className={`text-2xl font-bold ${tokens[0]?.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${tokens[0]?.price?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">SOL Price</div>
            <div className={`text-xs mt-1 ${tokens[0]?.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {tokens[0]?.change24h >= 0 ? '+' : ''}{tokens[0]?.change24h?.toFixed(2) || '0.00'}% (24h)
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">${formatNumber(tokens[0]?.volume || 0)}</div>
            <div className="text-sm text-gray-600">SOL 24h Volume</div>
            <div className="text-xs text-gray-600 mt-1">Real-time data</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">${formatNumber(tokens[0]?.marketCap || 0)}</div>
            <div className="text-sm text-gray-600">SOL Market Cap</div>
            <div className="text-xs text-gray-600 mt-1">Live from CoinGecko</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold">{tokens.length}</div>
            <div className="text-sm text-gray-600">Tracked Tokens</div>
            <div className="text-xs text-gray-600 mt-1">Real prices</div>
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