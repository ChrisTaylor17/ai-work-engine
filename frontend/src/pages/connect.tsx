import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface UserProfile {
  id: string;
  interests: string[];
  goals: string[];
  bio: string;
  skills: string[];
  timestamp: number;
}

export default function Connect() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [myProfile, setMyProfile] = useState({
    interests: '',
    goals: '',
    bio: '',
    skills: ''
  });
  const [mounted, setMounted] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const saveProfile = async () => {
    if (!connected || !publicKey) return;
    
    const profile: UserProfile = {
      id: publicKey.toBase58().slice(0, 8),
      interests: myProfile.interests.split(',').map(i => i.trim()).filter(i => i),
      goals: myProfile.goals.split(',').map(g => g.trim()).filter(g => g),
      bio: myProfile.bio,
      skills: myProfile.skills.split(',').map(s => s.trim()).filter(s => s),
      timestamp: Date.now()
    };
    
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      
      setProfiles(prev => [...prev.filter(p => p.id !== profile.id), profile]);
      
      // Get AI introduction suggestions
      const context = `User ${profile.id}: interests: ${profile.interests.join(', ')}, goals: ${profile.goals.join(', ')}, skills: ${profile.skills.join(', ')}. Other users: ${profiles.map(p => `${p.id} (${p.interests.join(', ')})`).join('; ')}`;
      
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Based on my profile, who should I connect with and why?',
          context 
        }),
      });
      
      if (aiResponse.ok) {
        const data = await aiResponse.json();
        setAiSuggestion(data.response);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
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
          <Link href="/connect" className="text-white border-b-2 border-white pb-1 font-medium">Connect</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Setup */}
        {connected && (
          <div className="border border-white p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Interests (comma separated)</label>
                <input
                  type="text"
                  value={myProfile.interests}
                  onChange={(e) => setMyProfile(prev => ({...prev, interests: e.target.value}))}
                  placeholder="AI, blockchain, music, art..."
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Goals (comma separated)</label>
                <input
                  type="text"
                  value={myProfile.goals}
                  onChange={(e) => setMyProfile(prev => ({...prev, goals: e.target.value}))}
                  placeholder="Build startup, learn coding, find co-founder..."
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={myProfile.skills}
                  onChange={(e) => setMyProfile(prev => ({...prev, skills: e.target.value}))}
                  placeholder="JavaScript, design, marketing, writing..."
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <input
                  type="text"
                  value={myProfile.bio}
                  onChange={(e) => setMyProfile(prev => ({...prev, bio: e.target.value}))}
                  placeholder="Tell others about yourself..."
                  className="w-full bg-black border border-white px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={saveProfile}
              className="bg-white text-black hover:bg-gray-200 px-6 py-2 font-medium"
            >
              Save Profile
            </button>
          </div>
        )}

        {/* AI Suggestions */}
        {aiSuggestion && (
          <div className="border border-white p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">AI Connection Suggestions</h3>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <div className="text-gray-100">{aiSuggestion}</div>
            </div>
          </div>
        )}

        {/* People Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div key={profile.id} className="border border-white p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <span className="text-black font-bold">{profile.id.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-bold">{profile.id}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(profile.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Bio</div>
                  <div className="text-gray-300 text-sm">{profile.bio}</div>
                </div>
              )}
              
              {profile.interests.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interest => (
                      <span key={interest} className="border border-white px-2 py-1 text-xs">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="bg-white text-black px-2 py-1 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="w-full border border-white hover:bg-white hover:text-black px-4 py-2 text-sm font-medium transition-colors">
                Connect
              </button>
            </div>
          ))}
          
          {profiles.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
                <span className="text-black font-bold text-xl">C</span>
              </div>
              <h3 className="text-xl font-bold mb-4">No Profiles Yet</h3>
              <p className="text-gray-400">
                Connect your wallet and create a profile to start meeting people
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}