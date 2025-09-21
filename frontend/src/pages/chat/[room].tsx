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
        message: `Welcome to #${room}! I'm your intelligent AI assistant. I can help you create projects, allocate tokens, find team members, and much more. What would you like to work on?`,
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

    // Award tokens for user interaction
    const tokensEarned = Math.floor(Math.random() * 10) + 5;
    
    setTimeout(() => {
      const aiResponse = getAiResponse(newMessage, room as string, tokensEarned);
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
      
      // Update user's token balance in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.tokens = (currentUser.tokens || 0) + tokensEarned;
      localStorage.setItem('user', JSON.stringify(currentUser));
    }, 1500);
  };

  const getAiResponse = (message: string, roomName: string, tokensEarned: number) => {
    const lowerMessage = message.toLowerCase();
    
    // Token allocation responses
    if (lowerMessage.includes('allocate') || lowerMessage.includes('token')) {
      const bonusTokens = Math.floor(Math.random() * 50) + 25;
      return `⚖️ **Token Allocation Complete!**

🎉 **TOKENS CREATED & DISTRIBUTED:**
• Lead Developer: 350 WORK tokens → SENT
• Frontend Developer: 250 WORK tokens → SENT
• Backend Developer: 250 WORK tokens → SENT
• Designer: 150 WORK tokens → SENT

💰 **YOU EARNED: +${tokensEarned + bonusTokens} WORK TOKENS!**
• Chat participation: +${tokensEarned} tokens
• Allocation bonus: +${bonusTokens} tokens

Transaction Hash: 0x${Math.random().toString(16).substr(2, 16)}

📊 **Your Balance Updated:**
Total WORK tokens: ${(JSON.parse(localStorage.getItem('user') || '{}').tokens || 0) + tokensEarned + bonusTokens}

All team members have been notified via Solana blockchain!`;
    }
    
    // Project creation responses
    if (lowerMessage.includes('create') || lowerMessage.includes('project') || lowerMessage.includes('build')) {
      const projectTokens = Math.floor(Math.random() * 100) + 50;
      return `🚀 **PROJECT CREATED SUCCESSFULLY!**

🎉 **"${message}" is now live!**
Project ID: PROJ_${Date.now()}

💰 **INITIAL TOKEN POOL CREATED:**
• Total supply: 10,000 WORK tokens
• Team allocation: 7,000 tokens (70%)
• Creator reward: 2,000 tokens (20%)
• Platform fee: 1,000 tokens (10%)

🎉 **YOU EARNED: +${tokensEarned + projectTokens} WORK TOKENS!**
• Chat participation: +${tokensEarned} tokens
• Project creation: +${projectTokens} tokens

📊 **Smart Contract Deployed:**
Contract: 0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}

🚀 **Next Steps:**
1. Project is posted on marketplace
2. AI is finding team members
3. Token rewards are active

Your project is earning tokens every minute!`;
    }
    
    // Team matching responses
    if (lowerMessage.includes('team') || lowerMessage.includes('find') || lowerMessage.includes('hire')) {
      return `🎯 **Team Matching Service:**

Searching for "${message}"...

👥 **Available Developers:**
• Sarah_K - React specialist, 4.9★, 30hrs/week
• Mike_B - Solidity expert, 4.8★, 25hrs/week  
• Alex_D - Full-stack dev, 4.7★, 35hrs/week
• Lisa_M - UI/UX designer, 4.9★, 20hrs/week

💰 **Hiring Incentives:**
• You earn: 25 WORK tokens per successful hire
• Developer earns: 15 WORK tokens for joining
• Project completion bonus: 200 tokens each

🚀 **Quick Actions:**
Type 'contact Sarah' to send hiring message
Type 'view profiles' for detailed information`;
    }
    
    // General help and other queries
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return `🤖 **AI Work Engine Assistant:**

I can help you with:

🚀 **Project Creation**
• Analyze your ideas
• Recommend tech stacks
• Estimate timelines and budgets
• Create project roadmaps

⚖️ **Token Allocation**
• Fair distribution calculations
• Market-rate analysis
• Blockchain distribution
• Performance-based rewards

🎯 **Team Matching**
• Find skilled developers
• Match based on availability
• Verify credentials and ratings
• Facilitate introductions

💡 **Try asking:**
• "Create a DeFi lending platform"
• "Allocate tokens for 5-person team"
• "Find a Solidity developer"`;
    }
    
    // Default intelligent response with token reward
    return `🤖 **AI Processing Complete!**

🎉 **TOKENS AWARDED: +${tokensEarned} WORK TOKENS!**
For engaging with AI assistant

Analyzing: "${message}"

💡 **AI Recommendations:**
• "create defi app" → Instant project + 75 tokens
• "allocate tokens" → Smart distribution + 50 tokens
• "find solidity dev" → Team matching + 25 tokens

💰 **Your Current Balance:**
${(JSON.parse(localStorage.getItem('user') || '{}').tokens || 0) + tokensEarned} WORK tokens

🚀 **Earning Opportunities:**
• Create projects: 50-150 tokens each
• Team matching: 25-75 tokens each
• Token allocation: 25-100 tokens each
• Daily chat bonus: 5-15 tokens

Every interaction earns you more tokens!`;
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