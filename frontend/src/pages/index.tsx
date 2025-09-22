import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  reward: number;
  timestamp: number;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    setMounted(true);
    loadTasks();
    if (connected && publicKey) {
      loadWalletData();
    }
  }, [connected, publicKey]);

  const loadTasks = () => {
    const saved = localStorage.getItem('consilience_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  };

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('consilience_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const loadWalletData = async () => {
    if (!publicKey) return;
    
    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      setBalance(solBalance / LAMPORTS_PER_SOL);

      // Get recent transactions
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
      const txs = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getTransaction(sig.signature);
          return {
            signature: sig.signature.slice(0, 20) + '...',
            slot: sig.slot,
            timestamp: sig.blockTime ? new Date(sig.blockTime * 1000) : new Date(),
            fee: tx?.meta?.fee || 0,
            status: sig.err ? 'Failed' : 'Success'
          };
        })
      );
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const handleAIChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.response || 'I can help you with crypto analysis and productivity tasks.');
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      setAiResponse('I can help you with productivity, crypto analysis, and blockchain tasks. What would you like to work on?');
    }
    setLoading(false);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      reward: Math.floor(Math.random() * 50) + 10,
      timestamp: Date.now()
    };
    
    saveTasks([...tasks, task]);
    setNewTask('');
  };

  const completeTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    saveTasks(updatedTasks);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalRewards = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.reward, 0);

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
              <p className="text-sm text-gray-600">Crypto Productivity Platform</p>
            </div>
          </div>
          
          {mounted && (
            <div className="flex items-center space-x-4">
              {connected && (
                <div className="text-right">
                  <div className="font-bold">{balance.toFixed(4)} SOL</div>
                  <div className="text-sm text-gray-600">{totalRewards} rewards earned</div>
                </div>
              )}
              <WalletMultiButton className="!bg-black !text-white hover:!bg-gray-800 !rounded-lg !text-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex space-x-8">
          <Link href="/" className="text-black border-b-2 border-black pb-1 font-medium">Dashboard</Link>
          <Link href="/portfolio" className="text-gray-600 hover:text-black font-medium">Portfolio</Link>
          <Link href="/goals" className="text-gray-600 hover:text-black font-medium">Goals</Link>
          <Link href="/wallet" className="text-gray-600 hover:text-black font-medium">Wallet</Link>
          <Link href="/nfts" className="text-gray-600 hover:text-black font-medium">NFTs</Link>
          <Link href="/analytics" className="text-gray-600 hover:text-black font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Assistant */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">AI Assistant</h2>
              
              <form onSubmit={handleAIChat} className="mb-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crypto, set goals, analyze blockchain data..."
                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-black bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={loading}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
                  >
                    {loading ? 'Thinking...' : 'Ask AI'}
                  </button>
                </div>
              </form>

              {aiResponse && (
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-black">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded">
                      C
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">CONSILIENCE AI</div>
                      <div className="text-gray-800">{aiResponse}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tasks */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-bold mb-4">Quick Tasks</h2>
              
              <div className="flex space-x-3 mb-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a productivity task..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
                />
                <button
                  onClick={addTask}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                    task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                        className="w-4 h-4"
                      />
                      <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                        {task.title}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{task.reward} pts
                    </div>
                  </div>
                ))}
                
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-2xl mb-2">📝</div>
                    <div>No tasks yet. Add one above!</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks Completed</span>
                  <span className="font-bold">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rewards</span>
                  <span className="font-bold text-green-600">{totalRewards} pts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SOL Balance</span>
                  <span className="font-bold">{balance.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            {connected && transactions.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-mono text-xs text-gray-600 truncate">
                        {tx.signature}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${tx.status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tx.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/nfts" className="block w-full bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                  🎨 Create NFT
                </Link>
                <Link href="/goals" className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                  🎯 Set Goals
                </Link>
                <Link href="/wallet" className="block w-full bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                  💰 View Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}