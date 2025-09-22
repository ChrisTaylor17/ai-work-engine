import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const lower = message.toLowerCase();
  let response = '';

  // More specific and varied responses
  if (lower.includes('talk to someone') || lower.includes('someone else')) {
    response = `I see you want to connect with other builders! Share this room URL with crypto enthusiasts. In the meantime, tell me about your project ideas - I can help you plan and create NFTs while we wait for others to join.`;
  } else if (lower === 'ok' || lower === 'okay') {
    response = `Cool! What's your next move? Want to create an NFT, discuss a project, or share what you're building? I'm here to help make it happen.`;
  } else if (lower.includes('create token') || lower.includes('token')) {
    response = `Token creation is powerful! I currently create NFTs on Solana with "create nft". For fungible tokens, I can help you plan tokenomics, distribution, and utility. What's your token concept?`;
  } else if (lower.includes('yes') || lower.includes('sure')) {
    response = `Awesome! Let's build something. Connect your wallet and type "create nft" for a real Solana NFT, or tell me about your project vision.`;
  } else if (lower.includes('no') || lower.includes('nope')) {
    response = `No worries! What interests you instead? DeFi protocols, NFT marketplaces, gaming tokens, or something else entirely?`;
  } else if (lower.includes('hello') || lower.includes('hi')) {
    response = `Hey there! I'm CONSILIENCE, your crypto building companion. I create real blockchain assets and help connect builders. What are you working on?`;
  } else if (lower.includes('help')) {
    response = `I'm your crypto project toolkit:\n• Real NFT creation on Solana\n• Project planning & tokenomics\n• Connecting with other builders\n• Technical blockchain guidance\n\nWhat challenge can I tackle for you?`;
  } else if (lower.includes('project') || lower.includes('idea')) {
    response = `Project time! I love helping builders turn ideas into reality. Tell me your vision - is it DeFi, NFTs, gaming, or something revolutionary? Let's brainstorm the technical approach.`;
  } else {
    const responses = [
      `That's intriguing! How can we turn this into a blockchain solution? I'm thinking NFTs, tokens, or maybe a DeFi protocol?`,
      `Interesting perspective! Want to explore how crypto could enhance this? I can help you build the technical foundation.`,
      `I hear you! Let's channel that energy into building something amazing. What crypto project has been on your mind?`,
      `Good point! Speaking of building - any blockchain projects you've been curious about? I can help make them real.`
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }

  res.status(200).json({ response });
}