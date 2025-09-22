import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createRealNFT } from '../utils/nft';

export default function Room() {
  const router = useRouter();
  const { room } = router.query;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string, id: number, user?: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const { connected, publicKey, sendTransaction } = useWallet();

  // Simple room state management (in production, use WebSocket/Socket.io)
  useEffect(() => {
    if (!room) return;
    
    // Load room messages from localStorage
    const roomKey = `room_${room}`;
    const savedMessages = localStorage.getItem(roomKey);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // Add user to room
    const userAddress = publicKey?.toBase58().slice(0, 8) || 'Anonymous';
    setUsers(prev => Array.from(new Set([...prev, userAddress])));

    // Poll for new messages every 2 seconds
    const interval = setInterval(() => {
      const currentMessages = localStorage.getItem(roomKey);
      if (currentMessages) {
        const parsed = JSON.parse(currentMessages);
        setMessages(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
            return parsed;
          }
          return prev;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [room, publicKey]);

  const saveMessages = (newMessages: any[]) => {
    if (room) {
      localStorage.setItem(`room_${room}`, JSON.stringify(newMessages));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const userAddress = publicKey?.toBase58().slice(0, 8) || 'Anonymous';
    setInput('');
    
    const newUserMessage = { 
      role: 'user', 
      content: userMessage, 
      id: Date.now(),
      user: userAddress
    };
    
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setLoading(true);

    try {
      let aiResponse = '';
      
      if (userMessage.toLowerCase().includes('create nft') && connected && publicKey) {
        const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        const nft = await createRealNFT({ publicKey, sendTransaction }, 'CONSILIENCE NFT', userMessage, imageUrl);
        aiResponse = `✨ NFT Created for ${userAddress}: ${nft.name}\n🔗 explorer.solana.com/address/${nft.mintAddress}?cluster=devnet`;
      } else if (userMessage.toLowerCase().includes('create nft')) {
        aiResponse = `${userAddress}, connect your wallet to create NFTs`;
      } else {
        // AI response for general chat
        try {
          console.log('Calling OpenAI API...');
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
          });
          
          console.log('API response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);
            aiResponse = data.response || 'I can help with crypto projects and connect people!';
          } else {
            const errorData = await response.text();
            console.error('API error response:', errorData);
            throw new Error(`API error: ${response.status}`);
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
          // Dynamic fallback responses when API fails
          const lower = userMessage.toLowerCase();
          const responses = {
            greetings: [`Hey ${userAddress}! Welcome to room ${room}. What crypto project are you working on?`, `Hi ${userAddress}! This room has ${users.length} builders. What brings you here?`, `Welcome ${userAddress}! Ready to build something amazing on Solana?`],
            help: [`I can help you build crypto projects, ${userAddress}! I create real NFTs, explain tokenomics, write whitepapers, and connect builders.`, `${userAddress}, I'm your crypto project assistant. Ask me about Solana development, DeFi, NFTs, or project planning!`, `Hey ${userAddress}! I help with everything crypto - from NFT creation to token economics. What do you need?`],
            projects: [`Interesting project idea, ${userAddress}! Tell me more about your vision. I can help with tokenomics and technical planning.`, `${userAddress}, that sounds like a solid project! Want me to help you create a whitepaper or roadmap?`, `Great thinking, ${userAddress}! I can help you build that. Should we start with an NFT or token creation?`],
            nft: [`${userAddress}, I create real NFTs on Solana! Connect your wallet and say "create nft" to build one.`, `NFTs are powerful, ${userAddress}! I can create real ones on Solana blockchain. Want to try?`, `${userAddress}, ready to mint an NFT? I'll create a real one on Solana for you!`],
            general: [`That's interesting, ${userAddress}! How does that relate to your crypto project?`, `${userAddress}, I'm thinking about that... How can we turn this into a blockchain solution?`, `Good point, ${userAddress}! Want to explore how blockchain could solve this?`, `${userAddress}, that reminds me of a DeFi project I helped with. Want to brainstorm?`]
          };
          
          let category = 'general';
          if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) category = 'greetings';
          else if (lower.includes('help') || lower.includes('what') || lower.includes('how')) category = 'help';
          else if (lower.includes('project') || lower.includes('build') || lower.includes('idea')) category = 'projects';
          else if (lower.includes('nft') || lower.includes('token') || lower.includes('mint')) category = 'nft';
          
          const categoryResponses = responses[category];
          aiResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
        }
      }

      const aiMessage = {
        role: 'ai',
        content: aiResponse,
        id: Date.now() + 1,
        user: 'CONSILIENCE'
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      const errorMessage = {
        role: 'ai',
        content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
        id: Date.now() + 1,
        user: 'CONSILIENCE'
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with room info */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs">C</span>
          </div>
          <div>
            <span className="text-white font-light text-lg tracking-widest">CONSILIENCE</span>
            <div className="text-white/50 text-xs">Room: {room} • {users.length} users</div>
          </div>
        </div>
        <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !border-white/20 !text-white !text-xs !px-3 !py-2 !rounded-full" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className="animate-fade-in"
              style={{ opacity: Math.max(0.3, 1 - (messages.length - index - 1) * 0.1) }}
            >
              <div className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                {message.role === 'ai' && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                )}
                <div className={`max-w-md ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className="text-xs text-white/50 mb-1">
                    {message.user || 'Unknown'}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${
                    message.role === 'user' 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    {message.content}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">{message.user?.charAt(0) || 'U'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-2xl">
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

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chat with room or ask AI to create nft..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              disabled={loading}
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