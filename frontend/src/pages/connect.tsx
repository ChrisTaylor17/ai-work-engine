import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Connect() {
  const [users, setUsers] = useState<Array<{id: string, interests: string[], goals: string[], tokens: number}>>([]);
  const [myProfile, setMyProfile] = useState({ interests: '', goals: '', bio: '' });
  const { connected, publicKey } = useWallet();

  const interests = ['DeFi', 'NFTs', 'Gaming', 'AI', 'Web3', 'Trading', 'Development', 'Art', 'Music', 'Fitness'];

  const saveProfile = () => {
    if (!connected) return;
    
    const profile = {
      id: publicKey?.toBase58().slice(0, 8) || 'Anonymous',
      interests: myProfile.interests.split(',').map(i => i.trim()),
      goals: myProfile.goals.split(',').map(g => g.trim()),
      tokens: Math.floor(Math.random() * 1000),
      bio: myProfile.bio
    };
    
    setUsers(prev => [...prev.filter(u => u.id !== profile.id), profile]);
  };

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
            <p className="text-white/60 text-xs">Connect & Collaborate</p>
          </div>
        </div>
        <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !rounded-full !text-sm" />
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Setup */}
          {connected && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
              <h2 className="text-white text-xl mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/80 text-sm block mb-2">Interests (comma separated)</label>
                  <input
                    type="text"
                    value={myProfile.interests}
                    onChange={(e) => setMyProfile(prev => ({...prev, interests: e.target.value}))}
                    placeholder="DeFi, NFTs, AI..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm block mb-2">Goals (comma separated)</label>
                  <input
                    type="text"
                    value={myProfile.goals}
                    onChange={(e) => setMyProfile(prev => ({...prev, goals: e.target.value}))}
                    placeholder="Build dApp, Learn Solana..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm block mb-2">Bio</label>
                  <input
                    type="text"
                    value={myProfile.bio}
                    onChange={(e) => setMyProfile(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Tell others about yourself..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>
              </div>
              <button
                onClick={saveProfile}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-lg text-white font-medium"
              >
                Save Profile
              </button>
            </div>
          )}

          {/* Interest Tags */}
          <div className="mb-8">
            <h3 className="text-white text-lg mb-4">Popular Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span key={interest} className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-white/80 text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user.id.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.id}</div>
                      <div className="text-cyan-400 text-sm">{user.tokens} CONSILIENCE</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-white/60 text-xs mb-1">Interests</div>
                  <div className="flex flex-wrap gap-1">
                    {user.interests.slice(0, 3).map(interest => (
                      <span key={interest} className="bg-white/10 px-2 py-1 rounded text-xs text-white/80">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-white/60 text-xs mb-1">Goals</div>
                  <div className="text-white/80 text-sm">{user.goals.slice(0, 2).join(', ')}</div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 hover:border-cyan-400/50 px-4 py-2 rounded-lg text-cyan-400 text-sm transition-all">
                  Connect
                </button>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-white/60 mb-4">
                  <div className="text-4xl mb-4">🤝</div>
                  <div>No users yet</div>
                  <div className="text-sm">Connect your wallet and create a profile to find others</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}