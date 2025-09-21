import { useState } from 'react';
import Layout from '../../components/Layout';
import { createWorkToken } from '../../utils/solana';
import { createMetaplexNFT } from '../../utils/metaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// AI response generator
function generateAIResponse(input: string): string {
  const lower = input.toLowerCase();
  
  if (lower.includes('hello') || lower.includes('hi')) {
    return `👋 **Hello!** I'm your AI Project Creator.

I can help you create real blockchain assets on Solana:

🎨 **"create nft"** - Generate AI art NFT
🚀 **"create project"** - Launch project tokens
💎 **"mint art"** - Create custom NFT

What would you like to build today?`;
  }
  
  if (lower.includes('help')) {
    return `🤖 **AI Project Creator Help**

**Blockchain Commands:**
• "create nft" - Generate AI art NFT with metadata
• "create project [name]" - Launch project tokens
• "mint art" - Create custom NFT artwork

**Requirements:**
• Connect Phantom wallet
• Have SOL for transaction fees (~0.01 SOL)
• Confirm transactions in wallet

**All assets are created on Solana Devnet!**`;
  }
  
  if (lower.includes('thank')) {
    return `🙏 **You're welcome!**

Happy to help you build on Solana blockchain!

Try creating an NFT or project token next! 🚀`;
  }
  
  // Default AI response
  return `🤖 **AI Project Creator**

I understand you said: "${input}"

I specialize in creating blockchain assets on Solana:

🎨 **"create nft"** - AI generated NFT
🚀 **"create project"** - Project tokens
💎 **"mint art"** - Custom artwork NFT

What would you like to create?`;
}



export default function ProjectCreator() {
  const { wallet, connected, publicKey, sendTransaction } = useWallet();
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'AI Project Creator',
      message: 'I create projects, tokens, and NFTs on Solana blockchain. Tell me what you want to build!',
      isAi: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      user: 'You',
      message: input,
      isAi: false,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    
    setTimeout(async () => {
      const tokensEarned = Math.floor(Math.random() * 15) + 10;
      let tokenData;
      let nftData;
      const lower = input.toLowerCase();
      
      let response = '';
      
      // Only create blockchain assets for specific commands
      const isBlockchainCommand = lower.includes('create nft') || lower.includes('create project') || lower.includes('mint art');
      
      if (isBlockchainCommand && (!connected || !publicKey)) {
        response = `⚠️ **WALLET NOT CONNECTED**

To create real blockchain assets:

1. Install Phantom wallet
2. Connect wallet to this site
3. Fund wallet with SOL for gas fees
4. Try your command again

💰 **Demo tokens awarded:** +${tokensEarned} WORK

Connect wallet for real blockchain transactions!`;
      } else if (isBlockchainCommand && connected && publicKey) {
        try {
          // Create NFT if requested
          if (lower.includes('nft') || lower.includes('art')) {
            const imageUrl = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;
            nftData = await createMetaplexNFT({ publicKey, sendTransaction }, `AI Generated NFT`, `Created from: ${input}`, imageUrl);
          } else if (lower.includes('create project') || lower.includes('start project')) {
            tokenData = await createWorkToken({ publicKey, sendTransaction }, tokensEarned + 50);
          }
        } catch (error: any) {
          const errorMsg = error.message || error.toString();
          
          if (errorMsg.includes('insufficient funds') || errorMsg.includes('0x1')) {
            response = `💰 **INSUFFICIENT SOL FOR TRANSACTION**

❌ Your wallet needs SOL to pay transaction fees

**Get Devnet SOL:**
1. Visit: https://faucet.solana.com
2. Enter your wallet address
3. Request 2 SOL (free for testing)
4. Wait 30 seconds, then try again

💡 **Need help?** Each transaction costs ~0.01 SOL

💰 **Demo tokens awarded:** +${tokensEarned} WORK`;
          } else {
            response = `❌ **BLOCKCHAIN ERROR**

Failed to create on Solana: ${errorMsg}

💡 **Common issues:**
• Insufficient SOL for gas fees
• Wallet not properly connected
• Network congestion

💰 **Demo tokens awarded:** +${tokensEarned} WORK

Please check wallet and try again!`;
          }
        }
      } else {
        // Regular AI responses for non-blockchain commands
        response = generateAIResponse(input);
      }
      
      if (response === '' && nftData) {
        response = `🎨 **NFT STRUCTURE CREATED!**

✅ **LIVE ON SOLANA BLOCKCHAIN**

🖼️ **NFT Details:**
Name: ${nftData.name}
Description: ${nftData.description}
Mint Address: ${nftData.mintAddress}

🔗 **Transaction Proof:**
Signature: ${nftData.signature}
Slot: ${nftData.slot}
Confirmed: ✓

🖼️ **NFT Image:**
${nftData.image}

🎉 **EARNED: +${tokensEarned + 25} WORK TOKENS!**
• NFT creation reward: +25 tokens
• Chat participation: +${tokensEarned} tokens

🔍 **VERIFY ON SOLANA EXPLORER:**
https://explorer.solana.com/address/${nftData.mintAddress}?cluster=devnet

✅ **Status:** CONFIRMED ON SOLANA DEVNET
NFT structure (0 decimals, supply=1) created successfully!

📝 **Note:** This creates a proper NFT foundation. Metadata is stored off-chain for display.`;
      } else if (lower.includes('create project') || lower.includes('start project')) {
        response = `🚀 **SOLANA PROJECT TOKEN DEPLOYED!**

🎉 **SPL TOKEN CREATED FOR "${input}"**
Project ID: PROJ_${Date.now()}

🔗 **SOLANA BLOCKCHAIN DATA:**
Mint Address: ${tokenData?.mintAddress || 'N/A'}
Transaction: ${tokenData?.signature || 'N/A'}
Block Time: ${tokenData ? new Date(tokenData.blockTime).toLocaleString() : 'N/A'}
Slot: ${tokenData?.slot || 'N/A'}

💰 **TOKEN SUPPLY CREATED:**
• Total Supply: 10,000 WORK tokens
• Your Reward: ${tokensEarned + 50} tokens
• Team Pool: 7,000 tokens (70%)
• Creator Pool: 2,000 tokens (20%)

🔍 **View on Solana Explorer:**
https://explorer.solana.com/address/${tokenData?.mintAddress || 'N/A'}?cluster=devnet

Your project tokens are live on Solana!`;
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Project Creator',
        message: response,
        isAi: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update user data only for blockchain commands
      if (isBlockchainCommand && (tokenData || nftData)) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.tokens = (currentUser.tokens || 0) + tokensEarned + (nftData ? 25 : 0);
        if (nftData) {
          currentUser.nfts = currentUser.nfts || [];
          currentUser.nfts.push(nftData);
        }
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
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
          <div className="mb-3">
            <WalletMultiButton className="!bg-white !text-black !font-mono !rounded-none" />
          </div>
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type: create nft, create project, mint art..."
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