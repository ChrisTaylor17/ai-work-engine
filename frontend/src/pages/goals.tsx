import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { rewardUser } from '../utils/token';

export default function Goals() {
  const [goals, setGoals] = useState<Array<{id: string, title: string, description: string, completed: boolean, reward: number}>>([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', reward: 10 });
  const { connected, publicKey, sendTransaction } = useWallet();

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      completed: false,
      reward: newGoal.reward
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', reward: 10 });
  };

  const completeGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !connected) return;

    // Reward user for completing goal
    const reward = await rewardUser({ publicKey, sendTransaction }, goal.reward, `Completed: ${goal.title}`);
    
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, completed: true } : g
    ));
  };

  const suggestedGoals = [
    { title: 'Learn Solana Development', reward: 50 },
    { title: 'Create First NFT', reward: 25 },
    { title: 'Join DeFi Protocol', reward: 30 },
    { title: 'Build Web3 App', reward: 100 },
    { title: 'Connect with 5 Builders', reward: 20 },
    { title: 'Complete Crypto Course', reward: 40 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <div>
            <h1 className="text-white text-xl font-light tracking-wider">CONSILIENCE</h1>
            <p className="text-white/60 text-xs">Goal Achievement System</p>
          </div>
        </div>
        <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !rounded-full !text-sm" />
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Add Goal */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
            <h2 className="text-white text-xl mb-4">Set New Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-white/80 text-sm block mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({...prev, title: e.target.value}))}
                  placeholder="What do you want to achieve?"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm block mb-2">Description</label>
                <input
                  type="text"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({...prev, description: e.target.value}))}
                  placeholder="More details..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm block mb-2">Token Reward</label>
                <input
                  type="number"
                  value={newGoal.reward}
                  onChange={(e) => setNewGoal(prev => ({...prev, reward: parseInt(e.target.value) || 10}))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
            <button
              onClick={addGoal}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-lg text-white font-medium"
            >
              Add Goal
            </button>
          </div>

          {/* Suggested Goals */}
          <div className="mb-8">
            <h3 className="text-white text-lg mb-4">Suggested Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestedGoals.map((goal, index) => (
                <div key={index} className="bg-white/5 backdrop-blur rounded-lg p-4 border border-white/10">
                  <div className="text-white font-medium mb-2">{goal.title}</div>
                  <div className="text-cyan-400 text-sm mb-3">{goal.reward} CONSILIENCE tokens</div>
                  <button
                    onClick={() => setNewGoal({ title: goal.title, description: '', reward: goal.reward })}
                    className="text-cyan-400 text-sm hover:text-cyan-300"
                  >
                    Add to My Goals
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Goals */}
          <div>
            <h3 className="text-white text-lg mb-4">My Goals</h3>
            <div className="space-y-4">
              {goals.map(goal => (
                <div key={goal.id} className={`bg-white/10 backdrop-blur rounded-2xl p-6 border ${goal.completed ? 'border-green-400/50' : 'border-white/20'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`text-lg font-medium mb-2 ${goal.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                        {goal.title}
                      </div>
                      {goal.description && (
                        <div className="text-white/60 text-sm mb-3">{goal.description}</div>
                      )}
                      <div className="text-cyan-400 text-sm">{goal.reward} CONSILIENCE tokens</div>
                    </div>
                    <div className="ml-4">
                      {goal.completed ? (
                        <div className="text-green-400 text-2xl">✅</div>
                      ) : (
                        <button
                          onClick={() => completeGoal(goal.id)}
                          disabled={!connected}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 px-6 py-2 rounded-lg text-white font-medium"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {goals.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-white/60 mb-4">
                    <div className="text-4xl mb-4">🎯</div>
                    <div>No goals set yet</div>
                    <div className="text-sm">Set your first goal above to start earning CONSILIENCE tokens</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}