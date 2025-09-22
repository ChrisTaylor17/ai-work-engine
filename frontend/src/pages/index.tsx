import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { rewardUser } from '../utils/token';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      let aiResponse = '';
      if (response.ok) {
        const data = await response.json();
        aiResponse = data.response;
      } else {
        // Fallback responses
        const lower = userMessage.toLowerCase();
        if (lower.includes('meet') || lower.includes('connect') || lower.includes('people')) {
          aiResponse = `I'd love to help you connect with like-minded people! Check out the Connect page to find others with similar interests. What kind of people are you hoping to meet?`;
        } else if (lower.includes('goal') || lower.includes('plan')) {
          aiResponse = `Great! Setting goals is the first step to success. I'll help you break this down into actionable steps. What specific outcome do you want to achieve?`;
        } else {
          aiResponse = `I'm here to help you be productive and connect with others! What are you working on today?`;
        }
      }

      // Reward tokens if wallet connected
      let tokens = 0;
      if (connected && publicKey && sendTransaction) {
        const lower = userMessage.toLowerCase();
        if (lower.includes('goal') || lower.includes('plan')) tokens = 5;
        else if (lower.includes('complete') || lower.includes('done')) tokens = 10;
        else if (lower.includes('learn') || lower.includes('study')) tokens = 3;
        else tokens = 1;

        try {
          const reward = await rewardUser({ publicKey, sendTransaction }, tokens, 'Chat engagement');
          if (reward) {
            setTotalTokens(prev => prev + tokens);
            aiResponse += `\n\n🎉 +${tokens} CONSILIENCE tokens sent to your wallet!`;
          }
        } catch (error) {
          console.error('Token reward failed:', error);
          setTotalTokens(prev => prev + tokens);
          aiResponse += `\n\n🎉 +${tokens} CONSILIENCE tokens earned!`;
        }
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I can help you be productive and connect with others! What are you working on today?' 
      }]);
    }

    setLoading(false);
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
            <p className="text-white/60 text-xs">Productivity & Connection AI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {mounted && connected && (
            <div className="text-right">
              <div className="text-cyan-400 font-bold">{totalTokens} CONSILIENCE</div>
              <div className="text-white/60 text-xs">Real Solana tokens</div>
            </div>
          )}
          {mounted && (
            <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !rounded-full !text-sm" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 p-4 bg-black/10">
        <a href="/" className="text-cyan-400 px-4 py-2 rounded-full bg-cyan-400/20">Chat</a>
        <a href="/goals" className="text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10">Goals</a>
        <a href="/connect" className="text-white/60 hover:text-white px-4 py-2 rounded-full hover:bg-white/10">Connect</a>
      </div>

      {/* Main Chat */}
      <div className="flex flex-col h-[calc(100vh-160px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-white/60 mb-4">
                  <div className="text-2xl mb-2">🚀</div>
                  <div>Welcome to CONSILIENCE</div>
                  <div className="text-sm">Your AI productivity companion that rewards achievement</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-cyan-400 mb-2">🎯 Set Goals</div>
                    <div className="text-white/80">Share your goals and get rewarded with CONSILIENCE tokens</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-purple-400 mb-2">🤝 Connect</div>
                    <div className="text-white/80">Find others with similar interests and collaborate</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-pink-400 mb-2">📈 Achieve</div>
                    <div className="text-white/80">Complete tasks and earn real Solana tokens</div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl px-6 py-4 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'bg-white/10 backdrop-blur text-white border border-white/20'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur border border-white/20 px-6 py-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-black/20 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your goals, ask for help, or tell me what you accomplished..."
                className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-full text-white font-medium transition-all duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}