import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function ChatRoom() {
  const router = useRouter();
  const { room } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        user: 'AI Assistant',
        avatar: '🤖',
        message: `Welcome to #${room}! I'm here to help you with project creation, token allocation, and team matching. Try asking me something!`,
        timestamp: new Date().toISOString(),
        isAi: true
      }
    ];
    setMessages(initialMessages);
  }, [room]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      user: 'You',
      avatar: '👤',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isAi: false
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsAiTyping(true);

    setTimeout(() => {
      const aiResponse = getAiResponse(newMessage, room as string);
      const aiMessage = {
        id: Date.now() + 1,
        user: 'AI Assistant',
        avatar: '🤖',
        message: aiResponse,
        timestamp: new Date().toISOString(),
        isAi: true
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1500);
  };

  const getAiResponse = (message: string, roomName: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (roomName === 'ai-help') {
      if (lowerMessage.includes('project') || lowerMessage.includes('create')) {
        return `🚀 **Project Creation Guide:**

1. **Describe your idea** - Tell me what you want to build
2. **Set requirements** - Skills needed, timeline, budget
3. **AI matching** - I'll find perfect team members
4. **Token allocation** - Fair distribution based on contributions
5. **Launch** - Start building together!

Try: &quot;Create a DeFi project&quot; or &quot;I need a mobile app team&quot;`;
      }
      
      if (lowerMessage.includes('token') || lowerMessage.includes('allocation')) {
        return `⚖️ **Token Allocation System:**

• **Contribution-based** - Rewards actual work done
• **Skill weighting** - Higher skills = higher allocation
• **Time tracking** - Fair compensation for time invested
• **Milestone bonuses** - Extra tokens for hitting goals

Example: &quot;Allocate tokens for our NFT marketplace project&quot;`;
      }
    }
    
    return `I understand you said &quot;${message}&quot;. How can I help you with:

🚀 **Project Creation** - Build something amazing
⚖️ **Token Allocation** - Fair reward distribution  
🎯 **Team Matching** - Find perfect collaborators

Just ask me anything!`;
  };

  return (
    <Layout>
      <div className="bg-black border-b border-white p-4">
        <h2 className="text-xl font-bold text-white font-mono retro-glow">&gt; #{room}_TERMINAL</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{msg.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`font-medium ${msg.isAi ? 'text-blue-400' : 'text-white'}`}>
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap">{msg.message}</div>
              </div>
            </div>
          </div>
        ))}
        
        {isAiTyping && (
          <div className="chat-message">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-blue-400">AI Assistant</span>
                  <span className="text-xs text-gray-500">typing...</span>
                </div>
                <div className="text-gray-300">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-black border-t border-white p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message #${room}`}
            className="flex-1 input-field rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary"
            disabled={!newMessage.trim() || isAiTyping}
          >
            Send
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          💡 Try: &quot;Create a new project&quot;, &quot;Allocate tokens&quot;, or &quot;Find team members&quot;
        </div>
      </div>
    </Layout>
  );
}