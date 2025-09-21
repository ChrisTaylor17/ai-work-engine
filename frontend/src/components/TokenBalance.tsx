import { useState, useEffect } from 'react';

export default function TokenBalance() {
  const [balance, setBalance] = useState(0);
  const [recentEarnings, setRecentEarnings] = useState([]);

  useEffect(() => {
    // Simulate token balance
    setBalance(Math.floor(Math.random() * 500) + 150);
    
    // Simulate recent earnings
    setRecentEarnings([
      { action: 'Project Created', amount: 25, time: '2 min ago' },
      { action: 'Team Match', amount: 15, time: '5 min ago' },
      { action: 'Token Allocation', amount: 50, time: '1 hour ago' }
    ]);
  }, []);

  return (
    <div className="card">
      <h3 className="text-white font-mono mb-4 retro-glow">[TOKEN_BALANCE]</h3>
      
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-white font-mono">{balance}</div>
        <div className="text-gray-400 font-mono">WORK TOKENS</div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-mono text-gray-400 mb-2">RECENT EARNINGS:</div>
        {recentEarnings.map((earning, i) => (
          <div key={i} className="flex justify-between text-sm font-mono">
            <span className="text-gray-300">{earning.action}</span>
            <span className="text-green-400">+{earning.amount}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white">
        <div className="text-xs font-mono text-gray-400">
          Solana Wallet: {Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 4)}
        </div>
      </div>
    </div>
  );
}