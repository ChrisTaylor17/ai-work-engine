import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Always try OpenAI first, then fallback
  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are CONSILIENCE, a sophisticated AI assistant that specializes in connecting professionals and entrepreneurs. You are intelligent, strategic, and focused on creating meaningful business relationships.

Your core capabilities:
- Analyze people's skills, interests, and goals to identify synergies
- Make strategic introductions between complementary professionals
- Provide insights on networking, collaboration, and business development
- Help users articulate their value proposition and needs
- Create NFTs when users say "create nft" or "create an nft"

Be professional, insightful, and always focused on creating value through connections. Ask strategic questions to understand what people need and what they can offer.

${context ? `Context about users: ${context}` : ''}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (openaiResponse.ok) {
      const data = await openaiResponse.json();
      const aiResponse = data.choices[0]?.message?.content || 'I can help you connect with others and build meaningful professional relationships.';
      return res.status(200).json({ response: aiResponse });
    }
  } catch (error) {
    console.error('OpenAI API failed, using fallbacks:', error);
  }

  // Smart fallback responses
  console.log('Using fallback responses');
    
    // Professional fallback responses
    const lower = message.toLowerCase();
    let response = '';

    if (lower.includes('create nft') || lower.includes('create an nft')) {
      response = `I can create real NFTs on Solana blockchain! Connect your wallet and I'll mint a unique NFT for you. What should your NFT represent? I'll create the artwork and mint it directly to your wallet.`;
    } else if (lower.includes('do you work') || lower.includes('are you working')) {
      response = `Yes, I'm fully operational! I'm an AI that specializes in connecting professionals and creating blockchain assets. I can help you network, set goals, create NFTs, and track your crypto productivity. What would you like to accomplish?`;
    } else if (lower.includes('entrepreneur') || lower.includes('skills')) {
      response = `Excellent! Entrepreneurs with strong skills are the backbone of innovation. What specific areas do you excel in? I can help connect you with complementary talent - perhaps technical co-founders, business development partners, or investors who align with your vision.`;
    } else if (lower.includes('hello') || lower.includes('hi')) {
      response = `Welcome! I'm CONSILIENCE, your AI-powered connection strategist. I analyze profiles, identify synergies, and facilitate meaningful professional relationships. Whether you're seeking co-founders, advisors, or collaborators, I'm here to help you find your perfect matches.`;
    } else if (lower.includes('connect') || lower.includes('meet') || lower.includes('people')) {
      response = `Perfect timing! I specialize in strategic introductions. The key is understanding not just what you do, but what you need and what you can offer others. Tell me about your current projects, goals, or the type of collaborators who would accelerate your success.`;
    } else if (lower.includes('build') || lower.includes('project') || lower.includes('startup')) {
      response = `Building something significant requires the right team and network. I'd love to learn more about your project - the vision, current challenges, and what kind of expertise would be most valuable. I can help you identify potential collaborators who complement your strengths.`;
    } else {
      const responses = [
        `That's fascinating! I'm always analyzing how different backgrounds and skills can create powerful collaborations. What drives your professional interests?`,
        `Interesting perspective! I specialize in identifying how people's unique strengths can complement each other. What are you most passionate about professionally?`,
        `I appreciate you sharing that. My role is connecting exceptional people who can accelerate each other's success. What are your current priorities?`,
        `Great to connect with you! I'm designed to understand what makes people tick professionally and help them find their ideal collaborators. What's your story?`
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    return res.status(200).json({ response });
}