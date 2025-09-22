import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { rewardUser } from '../utils/token';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  completed: boolean;
  reward: number;
  createdAt: number;
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'business',
    deadline: '',
    reward: 100
  });
  const [mounted, setMounted] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const { connected, publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    setMounted(true);
    loadGoals();
  }, []);

  const loadGoals = () => {
    const saved = localStorage.getItem('consilience_goals');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGoals(parsed);
      setTotalEarned(parsed.filter((g: Goal) => g.completed).reduce((sum: number, g: Goal) => sum + g.reward, 0));
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    localStorage.setItem('consilience_goals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      deadline: newGoal.deadline,
      completed: false,
      reward: newGoal.reward,
      createdAt: Date.now()
    };
    
    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    setNewGoal({ title: '', description: '', category: 'business', deadline: '', reward: 100 });
  };

  const completeGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.completed) return;

    // Reward user with tokens
    if (connected && publicKey) {
      try {
        await rewardUser({ publicKey, sendTransaction }, goal.reward, `Completed: ${goal.title}`);
      } catch (error) {
        console.error('Token reward failed:', error);
      }
    }

    const updatedGoals = goals.map(g => 
      g.id === goalId ? { ...g, completed: true } : g
    );
    saveGoals(updatedGoals);
    setTotalEarned(prev => prev + goal.reward);
  };

  const categories = ['business', 'technical', 'personal', 'networking', 'learning'];

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
          <Link href="/goals" className="text-white border-b-2 border-white pb-1 font-medium">Goals</Link>
          <Link href="/analytics" className="text-gray-400 hover:text-white font-medium">Analytics</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="border border-white p-6 text-center">
            <div className="text-2xl font-bold">{goals.length}</div>
            <div className="text-gray-400 text-sm">Total Goals</div>
          </div>
          <div className="border border-white p-6 text-center">
            <div className="text-2xl font-bold">{goals.filter(g => g.completed).length}</div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div className="border border-white p-6 text-center">
            <div className="text-2xl font-bold">{goals.filter(g => !g.completed).length}</div>
            <div className="text-gray-400 text-sm">Active</div>
          </div>
          <div className="border border-white p-6 text-center">
            <div className="text-2xl font-bold">{totalEarned}</div>
            <div className="text-gray-400 text-sm">Tokens Earned</div>
          </div>
        </div>

        {/* Add Goal */}
        <div className="border border-white p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Create New Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({...prev, title: e.target.value}))}
                placeholder="Launch my startup"
                className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal(prev => ({...prev, category: e.target.value}))}
                className="w-full bg-black border border-white px-4 py-2 text-white focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({...prev, description: e.target.value}))}
                placeholder="Build MVP and get first 100 users"
                className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({...prev, deadline: e.target.value}))}
                className="w-full bg-black border border-white px-4 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Token Reward</label>
              <input
                type="number"
                value={newGoal.reward}
                onChange={(e) => setNewGoal(prev => ({...prev, reward: parseInt(e.target.value) || 100}))}
                className="w-full bg-black border border-white px-4 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={addGoal}
            className="bg-white text-black hover:bg-gray-200 px-6 py-2 font-medium"
          >
            Create Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className={`border p-6 ${goal.completed ? 'border-gray-600 bg-gray-900' : 'border-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-lg font-bold ${goal.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <span className="border border-white px-2 py-1 text-xs">
                      {goal.category}
                    </span>
                  </div>
                  {goal.description && (
                    <p className={`mb-3 ${goal.completed ? 'text-gray-500' : 'text-gray-300'}`}>
                      {goal.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {goal.deadline && (
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    )}
                    <span>Reward: {goal.reward} CNSL</span>
                    <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {goal.completed ? (
                    <div className="text-green-400 text-2xl">✓</div>
                  ) : (
                    <button
                      onClick={() => completeGoal(goal.id)}
                      className="bg-white text-black hover:bg-gray-200 px-4 py-2 font-medium text-sm"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {goals.length === 0 && (
            <div className="text-center py-20 border border-white">
              <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
                <span className="text-black font-bold text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4">No Goals Yet</h3>
              <p className="text-gray-400">
                Create your first goal above to start earning CONSILIENCE tokens
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}