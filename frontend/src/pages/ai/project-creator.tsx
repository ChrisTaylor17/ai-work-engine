import { useState } from 'react';
import Layout from '../../components/Layout';

export default function ProjectCreator() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'AI Project Creator',
      message: 'I help you create new projects. Describe your idea and I will help you plan it.',
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
      
      if (lower.includes('defi') || lower.includes('finance')) {
        response = `DeFi project "${input}" analysis:\n\n🔧 TECH STACK:\n• Solidity smart contracts\n• React frontend\n• Web3 integration\n• Oracle price feeds\n\n👥 TEAM NEEDED:\n• Solidity dev (40% - 400 tokens)\n• Frontend dev (30% - 300 tokens)\n• Security auditor (20% - 200 tokens)\n• Product manager (10% - 100 tokens)\n\n⚡ NEXT STEPS:\n1. Create smart contract architecture\n2. Find Solidity developer\n3. Set up development environment\n\nType 'create project' to proceed!`;
      } else if (lower.includes('nft') || lower.includes('marketplace')) {
        response = `NFT project "${input}" breakdown:\n\n🎨 COMPONENTS:\n• Smart contract minting\n• Marketplace interface\n• Metadata storage (IPFS)\n• Payment processing\n\n💼 ROLES:\n• Solidity dev (35% - 350 tokens)\n• Frontend dev (25% - 250 tokens)\n• Designer (25% - 250 tokens)\n• Backend dev (15% - 150 tokens)\n\n🚀 TIMELINE: 8-10 weeks\n\nReady to start? Type 'find team'!`;
      } else if (lower.includes('create project') || lower.includes('start')) {
        response = `🎉 PROJECT CREATED!\n\nProject: "${input}"\nStatus: ACTIVE\nID: PROJ_${Date.now()}\n\n📋 TODO:\n• Post on team finder\n• Set up GitHub repo\n• Create project roadmap\n• Allocate initial tokens\n\n🔍 Finding team members now...\nCheck the Team Matcher for candidates!`;
      } else {
        response = `Analyzing "${input}"...\n\n🤖 AI ASSESSMENT:\n• Feasibility: HIGH\n• Market demand: STRONG\n• Technical complexity: MEDIUM\n\n💡 SUGGESTIONS:\n• Define core features first\n• Consider MVP approach\n• Plan token economics\n\nTell me more details or type 'create project' to proceed!`;
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Project Creator',
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
          <h1 className="text-xl font-bold text-white font-mono retro-glow">&gt; PROJECT_CREATOR_AI</h1>
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
              placeholder="Describe your project idea..."
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