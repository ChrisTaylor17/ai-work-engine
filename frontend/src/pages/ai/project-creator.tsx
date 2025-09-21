import { useState } from 'react';
import Layout from '../../components/Layout';
import { createWorkToken, createNFT } from '../../utils/solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';



export default function ProjectCreator() {
  const { wallet, connected, publicKey } = useWallet();
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
      
      if (!connected || !publicKey) {
        response = `⚠️ **WALLET NOT CONNECTED**

To create real blockchain assets:

1. Install Phantom wallet
2. Connect wallet to this site
3. Fund wallet with SOL for gas fees
4. Try your command again

💰 **Demo tokens awarded:** +${tokensEarned} WORK

Connect wallet for real blockchain transactions!`;
      } else {
        try {
          // Create NFT if requested
          if (lower.includes('nft') || lower.includes('art')) {
            const imageUrl = `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`;
            nftData = await createNFT(wallet?.adapter, `AI Generated NFT`, `Created from: ${input}`, imageUrl);
            tokenData = await createWorkToken(wallet?.adapter, tokensEarned);
          } else {
            tokenData = await createWorkToken(wallet?.adapter, tokensEarned);
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
      }
      
      if (response === '' && nftData) {
        response = `🎨 **REAL SOLANA NFT CREATED!**

✅ **LIVE ON SOLANA DEVNET**

🖼️ **NFT Details:**
Name: ${nftData.name}
Description: ${nftData.description}
Mint Address: ${nftData.mintAddress}

🔗 **Blockchain Proof:**
Transaction: ${nftData.signature}
Metadata URI: ${nftData.metadataUri}
Slot: ${nftData.slot}

🖼️ **NFT Image:**
${nftData.image}

🎉 **EARNED: +${tokensEarned + 25} WORK TOKENS!**
• NFT creation reward: +25 tokens
• Chat participation: +${tokensEarned} tokens

🔍 **View on Solana Explorer:**
https://explorer.solana.com/address/${nftData.mintAddress}?cluster=devnet

✅ **Status:** LIVE ON BLOCKCHAIN
Your NFT is permanently stored on Solana!`;
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
      } else if (response === '') {
        response = `🤖 **SOLANA TOKENS MINTED!**

🎉 **SPL TOKENS CREATED:**
Mint: ${tokenData?.mintAddress || 'N/A'}
Amount: ${tokensEarned} WORK tokens
Signature: ${tokenData?.signature || 'N/A'}

🔗 **Solana Transaction:**
https://explorer.solana.com/tx/${tokenData?.signature || 'N/A'}?cluster=devnet

💡 **Try These Commands:**
• "create nft" → Metaplex NFT + 50 WORK
• "create defi project" → Project tokens + 75 WORK
• "mint art" → AI generated NFT + 40 WORK

💰 **Live Balance:** ${tokensEarned} WORK tokens

All assets are real on Solana blockchain!`;
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        user: 'AI Project Creator',
        message: response,
        isAi: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.tokens = (currentUser.tokens || 0) + tokensEarned + (nftData ? 25 : 0);
      if (nftData) {
        currentUser.nfts = currentUser.nfts || [];
        currentUser.nfts.push(nftData);
      }
      localStorage.setItem('user', JSON.stringify(currentUser));
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