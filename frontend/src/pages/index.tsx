import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createRealNFT } from '../utils/nft';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  nft?: any;
  action?: 'nft_created' | 'user_joined' | 'goal_completed';
}

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userName = connected ? publicKey?.toBase58().slice(0, 8) || 'User' : 'Anonymous';
    setInput('');

    // Handle NFT creation
    if (userMessage.toLowerCase().includes('create nft') || userMessage.toLowerCase().includes('create an nft')) {
      if (!connected) {
        alert('Connect your wallet first to create NFTs');
        return;
      }

      setCreating(true);
      try {
        const imageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        const nft = await createRealNFT(
          { publicKey, sendTransaction },
          `${userName}'s NFT`,
          userMessage,
          imageUrl
        );

        const nftMessage: Message = {
          id: Date.now().toString(),
          user: userName,
          content: `🎨 Created NFT: "${userName}'s NFT"`,
          timestamp: Date.now(),
          nft: { ...nft, image: imageUrl },
          action: 'nft_created'
        };

        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: nftMessage }),
        });

        loadMessages();
      } catch (error) {
        alert('NFT creation failed. Make sure you have SOL for fees.');
      }
      setCreating(false);
      return;
    }

    // Regular message
    const message: Message = {
      id: Date.now().toString(),
      user: userName,
      content: userMessage,
      timestamp: Date.now()
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-screen bg-white text-black flex">
      {/* Sidebar */}
      <div className="w-80 bg-black text-white border-r border-gray-300">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold">CONSILIENCE</h1>
              <p className="text-xs text-gray-400">Build • Connect • Create</p>
            </div>
          </div>
          <WalletMultiButton className="!w-full !bg-white !text-black hover:!bg-gray-200 !text-sm !py-2" />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold mb-3 text-gray-400">ONLINE ({users.length})</h3>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>{user}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <div>💬 Chat with builders</div>
            <div>🎨 Type "create nft" to mint</div>
            <div>🤝 Connect wallets to collaborate</div>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-300 bg-gray-50">
          <h2 className="font-bold">Global Builder Chat</h2>
          <p className="text-sm text-gray-600">Connect with crypto builders worldwide</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold mb-2">Welcome to CONSILIENCE</h3>
              <p className="text-sm">Connect your wallet and start building with others</p>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-bold rounded">
                {message.user.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{message.user}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.action === 'nft_created' && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      NFT Created
                    </span>
                  )}
                </div>
                <div className="text-sm">{message.content}</div>
                
                {message.nft && (
                  <div className="mt-3 border border-gray-300 rounded-lg p-3 max-w-sm">
                    <img 
                      src={message.nft.image} 
                      alt="NFT" 
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="text-xs">
                      <div className="font-medium">{message.nft.name}</div>
                      <div className="text-gray-500 truncate">
                        Mint: {message.nft.mintAddress}
                      </div>
                      <a 
                        href={`https://explorer.solana.com/address/${message.nft.mintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View on Solana Explorer →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {creating && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center text-xs font-bold rounded">
                C
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">CONSILIENCE</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                    Creating NFT...
                  </span>
                </div>
                <div className="text-sm">🎨 Minting your NFT on Solana blockchain...</div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={connected ? "Message builders or type create nft..." : "Connect wallet to participate..."}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-black"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={!input.trim() || creating}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {creating ? 'Creating...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}