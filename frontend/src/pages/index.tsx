import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp: number}>>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.response, 
        timestamp: Date.now() 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I can help you connect with others and be productive. What would you like to explore?',
        timestamp: Date.now()
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
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
        <div className="max-w-4xl mx-auto px-6 py-3 flex space-x-8">
          <Link href="/" className="text-white border-b-2 border-white pb-1 font-medium">Chat</Link>
          <Link href="/connect" className="text-gray-400 hover:text-white font-medium">Connect</Link>
        </div>
      </div>

      {/* Chat */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white mx-auto mb-6 flex items-center justify-center">
                <span className="text-black font-bold text-xl">C</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">CONSILIENCE AI</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                I learn about you and help you connect with like-minded people. Tell me about your interests and goals.
              </p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                message.role === 'ai' ? 'bg-white' : 'bg-gray-800 border border-white'
              }`}>
                <span className={`font-bold text-sm ${
                  message.role === 'ai' ? 'text-black' : 'text-white'
                }`}>
                  {message.role === 'ai' ? 'C' : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-400 text-xs mb-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-white leading-relaxed">{message.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-400 text-xs mb-1">now</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white animate-pulse"></div>
                  <div className="w-2 h-2 bg-white animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-white animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white p-6">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about yourself and what you're working on..."
              className="flex-1 bg-black border border-white px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-6 py-3 font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}