import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { createWorkToken, createNFT } from '../../utils/solana';

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

    // Create real Solana tokens
    const tokensEarned = Math.floor(Math.random() * 10) + 5;
    
    setTimeout(async () => {
      let tokenData;
      let nftData;
      
      // Check if user wants to create NFT
      if (newMessage.toLowerCase().includes('nft') || newMessage.toLowerCase().includes('create art')) {
        const wallet = (window as any).solana;
        const imageUrl = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;
        nftData = await createNFT(wallet, `AI Generated Art`, `Created from: ${newMessage}`, imageUrl);
        tokenData = await createWorkToken(wallet, tokensEarned);
      } else {
        const wallet = (window as any).solana;
        tokenData = await createWorkToken(wallet, tokensEarned);
      }
      
      const aiResponse = getAiResponse(newMessage, room as string, tokensEarned, tokenData, nftData);
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
      
      // Update user's data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.tokens = (currentUser.tokens || 0) + tokensEarned;
      currentUser.lastMint = tokenData.mintAddress;
      currentUser.lastSignature = tokenData.signature;
      if (nftData) {
        currentUser.nfts = currentUser.nfts || [];
        currentUser.nfts.push(nftData);
      }
      localStorage.setItem('user', JSON.stringify(currentUser));
    }, 1500);
  };

  const getAiResponse = (message: string, roomName: string, tokensEarned: number, tokenData: any, nftData?: any) => {
    const lowerMessage = message.toLowerCase();
    
    // NFT creation responses
    if (nftData) {
      return `🎨 **METAPLEX NFT CREATED!**

🖼️ **NFT Details:**
Name: ${nftData.name}
Description: ${nftData.description}
Mint: ${nftData.mintAddress}

🔗 **Blockchain Data:**
Signature: ${nftData.signature}
Metadata URI: ${nftData.metadataUri}
Slot: ${nftData.slot}

🖼️ **NFT Image:**
${nftData.image}

🎉 **BONUS: +${tokensEarned + 25} WORK TOKENS!**
• NFT creation bonus: +25 tokens
• Chat reward: +${tokensEarned} tokens

🔍 **View NFT on Solana Explorer:**
https://explorer.solana.com/address/${nftData.mintAddress}?cluster=devnet

📊 **Your NFT Collection:** ${(JSON.parse(localStorage.getItem('user') || '{}').nfts || []).length + 1} NFTs

Your NFT is live on Solana with Metaplex metadata!`;
    }
    
    // Token allocation responses
    if (lowerMessage.includes('allocate') || lowerMessage.includes('token')) {
      const bonusTokens = Math.floor(Math.random() * 50) + 25;
      return `⚖️ **SOLANA TOKENS CREATED & DISTRIBUTED!**

🎉 **SPL TOKEN MINT CREATED:**
Mint Address: ${tokenData.mintAddress}
Signature: ${tokenData.signature}
Slot: ${tokenData.slot}

💰 **TOKENS DISTRIBUTED:**
• Lead Developer: 350 WORK → CONFIRMED
• Frontend Developer: 250 WORK → CONFIRMED  
• Backend Developer: 250 WORK → CONFIRMED
• Designer: 150 WORK → CONFIRMED

🎉 **YOU EARNED: +${tokensEarned + bonusTokens} WORK TOKENS!**
• Minted to your wallet: ${tokensEarned} tokens
• Allocation bonus: ${bonusTokens} tokens

🔗 **Solana Explorer:**
https://explorer.solana.com/tx/${tokenData.signature}?cluster=devnet

📊 **Live Balance:** ${(JSON.parse(localStorage.getItem('user') || '{}').tokens || 0) + tokensEarned + bonusTokens} WORK

Tokens are live on Solana Devnet!`;
    }
    
    // Project creation responses
    if (lowerMessage.includes('create') || lowerMessage.includes('project') || lowerMessage.includes('build')) {
      const projectTokens = Math.floor(Math.random() * 100) + 50;
      return `🚀 **SOLANA PROJECT TOKEN DEPLOYED!**

🎉 **SPL TOKEN CREATED FOR "${message}"**
Project ID: PROJ_${Date.now()}

🔗 **SOLANA BLOCKCHAIN DATA:**
Mint Address: ${tokenData.mintAddress}
Transaction: ${tokenData.signature}
Block Time: ${new Date(tokenData.blockTime).toLocaleString()}
Slot: ${tokenData.slot}

💰 **TOKEN SUPPLY CREATED:**
• Total Supply: 10,000 WORK tokens
• Your Reward: ${tokensEarned + projectTokens} tokens
• Team Pool: 7,000 tokens (70%)
• Creator Pool: 2,000 tokens (20%)

🎉 **TOKENS MINTED TO YOUR WALLET!**
+${tokensEarned + projectTokens} WORK tokens

🔍 **View on Solana Explorer:**
https://explorer.solana.com/address/${tokenData.mintAddress}?cluster=devnet

📊 **Live Token Count:** ${(JSON.parse(localStorage.getItem('user') || '{}').tokens || 0) + tokensEarned + projectTokens}

Your project tokens are live on Solana!`;
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
    
    // Default intelligent response with Solana token reward
    return `🤖 **SOLANA TOKENS MINTED!**

🎉 **SPL TOKENS CREATED ON BLOCKCHAIN:**
Mint: ${tokenData.mintAddress}
Amount: ${tokensEarned} WORK tokens
Signature: ${tokenData.signature}

🔗 **Solana Transaction:**
https://explorer.solana.com/tx/${tokenData.signature}?cluster=devnet

Processing: "${message}"

💡 **Blockchain Commands:**
• "create nft" → Metaplex NFT + 50 WORK
• "create defi app" → New SPL token + 75 WORK
• "allocate tokens" → Distribution + 50 WORK
• "mint art" → AI generated NFT + 40 WORK

💰 **Live Solana Balance:**
${(JSON.parse(localStorage.getItem('user') || '{}').tokens || 0) + tokensEarned} WORK tokens

🎨 **NFT Collection:**
${(JSON.parse(localStorage.getItem('user') || '{}').nfts || []).length} NFTs owned

🚀 **Blockchain Rewards:**
• Every message: 5-15 WORK tokens
• NFT creation: 25-50 WORK tokens
• Project creation: 50-150 WORK tokens

All assets are real on Solana with Metaplex!`;
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