import { useState } from 'react';
import Layout from '../../components/Layout';

export default function TokenAllocator() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'AI Token Allocator',
      message: 'I help allocate tokens fairly based on contributions. Tell me about your project and team.',
      isAi: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      user: 'You',
      message: input,
      isAi: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    
    setTimeout(() => {
      let response = '';
      const lower = input.toLowerCase();
      
      if (lower.includes('approve') || lower.includes('yes') || lower.includes('confirm')) {
        response = `✅ TOKENS ALLOCATED ON SOLANA!\n\nTransaction Hash: 0x${Math.random().toString(16).substr(2, 8)}...\n\n💰 DISTRIBUTION COMPLETE:\n• Lead Dev: 300 WORK tokens → Wallet confirmed\n• Frontend: 250 WORK tokens → Wallet confirmed\n• Backend: 250 WORK tokens → Wallet confirmed\n• Designer: 150 WORK tokens → Wallet confirmed\n• Marketing: 50 WORK tokens → Wallet confirmed\n\n🎉 YOU EARNED: 50 WORK tokens (allocation fee)\n📊 YOUR BALANCE: ${Math.floor(Math.random() * 300) + 200} WORK tokens\n\nAll team members notified via Solana messaging!`;
      } else if (lower.includes('balance') || lower.includes('my tokens')) {
        response = `💰 YOUR TOKEN PORTFOLIO:\n\nCurrent Balance: ${Math.floor(Math.random() * 500) + 150} WORK tokens\n\n📊 EARNINGS BREAKDOWN:\n• Project creation: 125 tokens\n• Team matching: 75 tokens\n• Token allocation: 100 tokens\n• Completed projects: 200 tokens\n\n🚀 RECENT ACTIVITY:\n• +25 tokens - Team match reward\n• +50 tokens - Project completion bonus\n• +15 tokens - Profile completion\n\nSolana wallet: ${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
      } else {
        response = `Token allocation for "${input}":\n\n💰 TOTAL POOL: ${Math.floor(Math.random() * 500) + 500} WORK tokens\n\n📊 SMART ALLOCATION:\n• Lead Developer: ${Math.floor(Math.random() * 100) + 250} tokens (${Math.floor(Math.random() * 10) + 25}%)\n• Frontend Dev: ${Math.floor(Math.random() * 50) + 200} tokens (${Math.floor(Math.random() * 5) + 20}%)\n• Backend Dev: ${Math.floor(Math.random() * 50) + 200} tokens (${Math.floor(Math.random() * 5) + 20}%)\n• Designer: ${Math.floor(Math.random() * 50) + 100} tokens (${Math.floor(Math.random() * 5) + 15}%)\n\n⚖️ AI Analysis: Based on market rates, skill rarity, time commitment\n💰 Your fee: 50 WORK tokens\n\nType 'approve' to distribute on Solana blockchain!`;
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Token Allocator',
        message: response,
        isAi: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);

    setInput('');
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col bg-black">
        <div className="bg-black border-b border-white p-4">
          <h1 className="text-xl font-bold text-white font-mono retro-glow">&gt; TOKEN_ALLOCATOR_AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="p-4 border-l-2 border-white">
              <div className="font-mono text-sm text-gray-400 mb-2">
                [{msg.isAi ? 'AI' : 'USER'}] {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-white font-mono whitespace-pre-wrap">{msg.message}</div>
            </div>
          ))}
        </div>

        <div className="bg-black border-t border-white p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your project and team..."
              className="flex-1 input-field rounded-none px-4 py-2"
            />
            <button onClick={handleSend} className="btn-primary rounded-none">
              SEND
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}