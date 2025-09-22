import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { rewardUser } from '../utils/token';
import { createRealNFT } from '../utils/nft';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string, user?: string, timestamp?: number, nft?: any}>>([]);
  const [loading, setLoading] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
  const { connected, publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    setMounted(true);
    
    // Load global chat messages
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/rooms/global');
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveMessage = async (message: any) => {
    try {
      await fetch('/api/rooms/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const userAddress = publicKey?.toBase58().slice(0, 8) || 'Anonymous';
    setInput('');
    
    const newMessage = {
      role: 'user',
      content: userMessage,
      user: userAddress,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    saveMessage(newMessage);
    setLoading(true);

    try {
      let aiResponse = '';
      let nftData = null;
      
      // Handle NFT creation
      if (userMessage.toLowerCase().includes('create nft') && connected && publicKey) {
        try {
          const imageUrl = `https://picsum.photos/800/800?random=${Date.now()}`;
          const nft = await createRealNFT({ publicKey, sendTransaction }, 'CONSILIENCE NFT', userMessage, imageUrl);
          nftData = { ...nft, image: imageUrl };
          aiResponse = `✨ I've created your NFT! It represents "${userMessage}" and is now permanently stored on Solana blockchain.`;
        } catch (error) {
          aiResponse = `I had trouble creating your NFT. Make sure your wallet is connected and has some SOL for transaction fees.`;
        }
      } else {
        // AI conversation
        try {
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: `You are CONSILIENCE, a sophisticated AI assistant in a global chat room. You help with productivity, create NFTs, and facilitate meaningful conversations. Be conversational, intelligent, and helpful. Keep responses concise but engaging.`
                },
                ...messages.slice(-5).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                { role: 'user', content: userMessage }
              ],
              max_tokens: 200,
              temperature: 0.8,
            }),
          });
          
          if (openaiResponse.ok) {
            const data = await openaiResponse.json();
            aiResponse = data.choices[0]?.message?.content || 'I can help you with productivity and creating NFTs!';
          } else {
            throw new Error('OpenAI API failed');
          }
        } catch (error) {
          // Smart fallbacks
          const lower = userMessage.toLowerCase();
          if (lower.includes('hello') || lower.includes('hi')) {
            aiResponse = `Hello ${userAddress}! Welcome to CONSILIENCE. I can help with productivity, create NFTs, and connect you with other builders here.`;
          } else if (lower.includes('nft')) {
            aiResponse = `I create real NFTs on Solana! Just say "create nft" and describe what you want it to represent.`;
          } else {
            aiResponse = `Interesting perspective, ${userAddress}. I'm here to help with productivity and blockchain projects. What are you working on?`;
          }
        }
      }

      // Reward tokens
      if (connected && publicKey) {
        const lower = userMessage.toLowerCase();
        let tokens = lower.includes('create nft') ? 50 : lower.length > 20 ? 3 : 1;
        
        try {
          await rewardUser({ publicKey, sendTransaction }, tokens, 'Chat participation');
          setTotalTokens(prev => prev + tokens);
        } catch (error) {
          console.error('Token reward failed:', error);
        }
      }

      const aiMessage = {
        role: 'ai',
        content: aiResponse,
        user: 'CONSILIENCE',
        timestamp: Date.now(),
        nft: nftData
      };

      setMessages(prev => [...prev, aiMessage]);
      saveMessage(aiMessage);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-light tracking-wider">CONSILIENCE</h1>
              <p className="text-gray-400 text-xs">Global AI-Powered Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {mounted && connected && (
              <div className="text-right">
                <div className="text-white font-medium">{totalTokens} CONSILIENCE</div>
                <div className="text-gray-400 text-xs">Blockchain tokens</div>
              </div>
            )}
            {mounted && (
              <WalletMultiButton className="!bg-white !text-black hover:!bg-gray-200 !rounded-lg !font-medium !text-sm !px-4 !py-2" />
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-3 flex space-x-8">
          <Link href="/" className="text-white border-b-2 border-white pb-2 text-sm font-medium">Global Chat</Link>
          <Link href="/goals" className="text-gray-400 hover:text-white pb-2 text-sm">Goals</Link>
          <Link href="/connect" className="text-gray-400 hover:text-white pb-2 text-sm">Connect</Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="max-w-6xl mx-auto flex h-[calc(100vh-140px)]">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">C</span>
                </div>
                <h2 className="text-2xl font-light mb-4">Welcome to CONSILIENCE</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  A sophisticated AI workspace where you can chat with others, set goals, create NFTs, and build meaningful connections.
                </p>
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-sm">
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                    <div className="w-8 h-8 bg-white rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-black text-lg">💬</span>
                    </div>
                    <h3 className="font-medium mb-2">Global Chat</h3>
                    <p className="text-gray-400">Connect with builders worldwide</p>
                  </div>
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                    <div className="w-8 h-8 bg-white rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-black text-lg">🎨</span>
                    </div>
                    <h3 className="font-medium mb-2">Create NFTs</h3>
                    <p className="text-gray-400">Mint real blockchain assets</p>
                  </div>
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                    <div className="w-8 h-8 bg-white rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-black text-lg">🎯</span>
                    </div>
                    <h3 className="font-medium mb-2">Achieve Goals</h3>
                    <p className="text-gray-400">Earn tokens for productivity</p>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'ai' 
                    ? 'bg-gradient-to-br from-white to-gray-400' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-800'
                }`}>
                  <span className={`font-bold text-sm ${
                    message.role === 'ai' ? 'text-black' : 'text-white'
                  }`}>
                    {message.role === 'ai' ? 'C' : message.user?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.user || 'Unknown'}</span>
                    <span className="text-gray-500 text-xs">
                      {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <div className="text-gray-100 leading-relaxed">{message.content}</div>
                  {message.nft && (
                    <div className="mt-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 max-w-md">
                      <img src={message.nft.image} alt="NFT" className="w-full h-48 object-cover rounded-lg mb-3" />
                      <div className="text-sm">
                        <div className="font-medium mb-1">{message.nft.name}</div>
                        <div className="text-gray-400 text-xs mb-2">Mint: {message.nft.mintAddress?.slice(0, 20)}...</div>
                        <a 
                          href={`https://explorer.solana.com/address/${message.nft.mintAddress}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-gray-300 text-xs underline"
                        >
                          View on Solana Explorer →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">C</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">CONSILIENCE</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-6 bg-gradient-to-r from-gray-900 to-black">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message CONSILIENCE or chat with others..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-all duration-200"
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