import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createRealNFT } from '../utils/nft';

export default function Consilience() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string, id: number}>>([]);
  const [loading, setLoading] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, id: Date.now() }]);
    setLoading(true);

    try {
      if (userMessage.toLowerCase().includes('create nft') && connected && publicKey) {
        const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        const nft = await createRealNFT({ publicKey, sendTransaction }, 'CONSILIENCE NFT', userMessage, imageUrl);
        
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `✨ NFT Created: ${nft.name}\n🔗 explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`,
          id: Date.now() + 1
        }]);
      } else if (userMessage.toLowerCase().includes('create nft')) {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: 'Connect wallet to create NFTs',
          id: Date.now() + 1
        }]);
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });
        
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'ai',
          content: data.response || 'I can help with anything. Try "create nft" to build.',
          id: Date.now() + 1
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        id: Date.now() + 1
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Floating Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs">C</span>
          </div>
          <span className="text-white font-light text-lg tracking-widest">CONSILIENCE</span>
        </div>
      </div>

      {/* Floating Wallet */}
      <div className="absolute top-6 right-6 z-10">
        <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !text-xs !px-3 !py-2 !rounded-full" />
      </div>

      {/* Messages - Fade and scroll */}
      <div className="flex-1 overflow-y-auto px-6 pt-20 pb-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`animate-fade-in transition-opacity duration-1000 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
              style={{ opacity: Math.max(0.2, 1 - (messages.length - index - 1) * 0.15) }}
            >
              <div className={`inline-block max-w-md px-4 py-2 rounded-2xl text-sm ${
                message.role === 'user' 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="text-left animate-fade-in">
              <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Input - Centered */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or create nft..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all text-center"
              disabled={loading}
              autoFocus
            />
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}