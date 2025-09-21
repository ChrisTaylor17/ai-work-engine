import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createRealNFT } from '../utils/nft';

export default function Consilience() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Welcome to CONSILIENCE. I create real NFTs on Solana. What shall we build?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      if (userMessage.toLowerCase().includes('create nft') && connected && publicKey) {
        const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        const nft = await createRealNFT({ publicKey, sendTransaction }, 'CONSILIENCE NFT', userMessage, imageUrl);
        
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `✨ **NFT CREATED**\n\n**${nft.name}**\n${nft.description}\n\n🔗 [View on Solana](https://explorer.solana.com/address/${nft.mintAddress}?cluster=devnet)\n\n*Permanently stored on blockchain*`
        }]);
      } else if (userMessage.toLowerCase().includes('create nft')) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: '🔗 **Connect your wallet to create real NFTs on Solana**'
        }]);
      } else {
        // AI response for general chat
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });
        
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'ai',
          content: data.response || 'I can help you create NFTs and discuss any topic. Try "create nft" to build something!'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Something went wrong'}`
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <h1 className="text-2xl font-light text-white tracking-wider">CONSILIENCE</h1>
        </div>
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !text-sm" />
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-[calc(100vh-88px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-6 py-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-purple-600 text-white ml-12' 
                  : 'bg-slate-800/50 text-gray-100 mr-12 border border-purple-500/20'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-purple-500/20 px-6 py-4 rounded-2xl mr-12">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-purple-500/20">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or type 'create nft' to build..."
              className="flex-1 bg-slate-800/50 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}