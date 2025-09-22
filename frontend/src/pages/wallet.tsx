import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface TokenAccount {
  mint: string;
  balance: number;
  decimals: number;
  symbol: string;
}

export default function Wallet() {
  const [balance, setBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      loadWalletData();
    }
  }, [connected, publicKey, connection]);

  const loadWalletData = async () => {
    if (!publicKey) return;
    setLoading(true);

    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      setBalance(solBalance / LAMPORTS_PER_SOL);

      // Get recent transactions
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
      const txs = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            slot: sig.slot,
            timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
            fee: tx?.meta?.fee || 0,
            status: sig.err ? 'Failed' : 'Success'
          };
        })
      );
      setTransactions(txs);

      // Mock token data (in production, fetch real token accounts)
      setTokens([
        {
          mint: 'CONSILIENCE',
          balance: 1250,
          decimals: 2,
          symbol: 'CNSL'
        }
      ]);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
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
          <Link href="/portfolio" className="text-gray-400 hover:text-white font-medium">Portfolio</Link>
          <Link href="/goals" className="text-gray-400 hover:text-white font-medium">Goals</Link>
          <Link href="/wallet" className="text-white border-b-2 border-white pb-1 font-medium">Wallet</Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!connected ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
              <span className="text-black font-bold text-xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">
              View your real-time Solana wallet data and transaction history
            </p>
          </div>
        ) : (
          <>
            {/* Wallet Address */}
            <div className="border border-white p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Wallet Address</h2>
              <div className="font-mono text-sm text-gray-300 break-all">
                {publicKey?.toBase58()}
              </div>
              <div className="mt-4 flex space-x-4">
                <a
                  href={`https://explorer.solana.com/address/${publicKey?.toBase58()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white hover:bg-white hover:text-black px-4 py-2 text-sm font-medium transition-colors"
                >
                  View on Explorer
                </a>
                <button
                  onClick={loadWalletData}
                  disabled={loading}
                  className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-4 py-2 text-sm font-medium"
                >
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>

            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border border-white p-6 text-center">
                <div className="text-3xl font-bold mb-2">{balance.toFixed(4)}</div>
                <div className="text-gray-400 text-sm">SOL Balance</div>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ ${(balance * 20).toFixed(2)} USD
                </div>
              </div>
              {tokens.map(token => (
                <div key={token.mint} className="border border-white p-6 text-center">
                  <div className="text-3xl font-bold mb-2">{token.balance}</div>
                  <div className="text-gray-400 text-sm">{token.symbol}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {token.mint}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading transactions...</div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <div key={tx.signature} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-gray-300 mb-1">
                          {tx.signature.slice(0, 20)}...{tx.signature.slice(-20)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tx.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium text-sm ${
                          tx.status === 'Success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.status}
                        </div>
                        <div className="text-xs text-gray-500">
                          Fee: {(tx.fee / LAMPORTS_PER_SOL).toFixed(6)} SOL
                        </div>
                      </div>
                      <div className="ml-4">
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-gray-300 text-xs underline"
                        >
                          View →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No transactions found
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}