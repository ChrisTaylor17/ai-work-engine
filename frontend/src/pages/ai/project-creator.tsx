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
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Project Creator',
        message: `Great idea! For "${input}" project:\n\n📋 REQUIREMENTS:\n• Frontend: React/Next.js developer\n• Backend: Node.js/Express developer\n• Blockchain: Solidity developer\n• Design: UI/UX designer\n\n💰 ESTIMATED TOKENS: 500-750 WORK\n⏱️ TIMELINE: 6-8 weeks\n\nShall I create this project and start finding team members?`,
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