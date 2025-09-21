import { useState } from 'react';
import Layout from '../../components/Layout';

export default function TeamMatcher() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'AI Team Matcher',
      message: 'I help you find perfect team members. Tell me what skills you need.',
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
      
      if (lower.includes('yes') || lower.includes('contact') || lower.includes('hire')) {
        response = `🎉 TEAM MEMBER CONTACTED!\n\nJohn_Dev has been notified about your project.\n\n💰 TOKEN REWARD: +25 WORK tokens\n📧 Contact initiated via blockchain messaging\n⏰ Expected response: 2-4 hours\n\n📊 YOUR STATS:\n• Total tokens: 175 WORK\n• Projects created: 2\n• Team matches: 5\n\nJohn_Dev will receive 15 WORK tokens for responding.\nSuccessful collaboration = 200 token bonus each!`;
      } else if (lower.includes('solidity') || lower.includes('web3') || lower.includes('blockchain')) {
        response = `🔍 BLOCKCHAIN DEVELOPERS FOUND:\n\n• Mike_Build - Solidity expert - 25hrs/week\n  └ 3 DeFi projects completed\n  └ 450 WORK tokens earned\n  └ 5-star rating\n\n• Alex_Chain - Web3 specialist - 20hrs/week\n  └ NFT marketplace experience\n  └ 320 WORK tokens earned\n  └ Available immediately\n\n💡 TIP: Type 'contact Mike' to hire instantly!\n🪙 Hiring costs 10 WORK tokens (refunded on project completion)`;
      } else {
        response = `🔍 SEARCHING TALENT POOL...\n\nFound ${Math.floor(Math.random() * 8) + 3} developers matching "${input}":\n\n• John_Dev - React/Node.js - 30hrs/week - 380 tokens earned\n• Sarah_Code - Python/AI - 20hrs/week - 290 tokens earned\n• Mike_Build - Solidity/Web3 - 25hrs/week - 450 tokens earned\n\n💰 HIRING REWARDS:\n• You get: 25 WORK tokens for successful match\n• Developer gets: 15 WORK tokens for responding\n• Both get: 200 token bonus on project completion\n\nType 'contact [name]' to hire!`;
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Team Matcher',
        message: response,
        isAi: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);

    setInput('');
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col bg-black">
        <div className="bg-black border-b border-white p-4">
          <h1 className="text-xl font-bold text-white font-mono retro-glow">&gt; TEAM_MATCHER_AI</h1>
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
              placeholder="Enter skills needed..."
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