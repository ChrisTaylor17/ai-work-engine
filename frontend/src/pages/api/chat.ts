import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Simple AI responses for now - replace with OpenAI when working
  const lower = message.toLowerCase();
  let response = '';

  if (lower.includes('create token') || lower.includes('token')) {
    response = `I can help you create tokens! For now, I create NFTs on Solana with "create nft". Token creation coming soon. What kind of token are you thinking about?`;
  } else if (lower.includes('yes') || lower.includes('sure')) {
    response = `Great! Connect your wallet and type "create nft" to build a real NFT on Solana blockchain. What should we create?`;
  } else if (lower.includes('no') || lower.includes('nope')) {
    response = `No problem! What else can I help you with? I can discuss crypto projects, explain blockchain concepts, or create NFTs.`;
  } else if (lower.includes('chat') || lower.includes('talk') || lower.includes('user')) {
    response = `To chat with other users, just type normally! Everyone in this room can see your messages. Share the room URL with friends to invite them. What would you like to discuss?`;
  } else if (lower.includes('hello') || lower.includes('hi')) {
    response = `Hello! I'm CONSILIENCE, your crypto project assistant. I can create real NFTs on Solana, help with project planning, and facilitate discussions. What brings you here?`;
  } else if (lower.includes('help')) {
    response = `I can help with:\n• Creating real NFTs on Solana ("create nft")\n• Crypto project planning and tokenomics\n• Connecting builders in this room\n• Blockchain development questions\n\nWhat do you need help with?`;
  } else {
    response = `Interesting! I'm here to help with crypto projects and blockchain development. Want to create an NFT, discuss a project idea, or connect with other builders?`;
  }

  res.status(200).json({ response });
}