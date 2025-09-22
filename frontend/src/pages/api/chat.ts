import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Chat API called:', req.method, req.body);
  
  if (req.method !== 'POST') {
    console.log('Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  console.log('Message received:', message);

  if (!message) {
    console.log('No message provided');
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Check if OpenAI API key exists
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable');
      throw new Error('No API key configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are CONSILIENCE - an AI assistant in a crypto project building community. You help people collaborate on blockchain projects and create real NFTs on Solana.

Your role:
1. **Community Helper**: Connect people, facilitate discussions about crypto projects
2. **Project Builder**: Help with tokenomics, whitepapers, project planning
3. **NFT Creator**: Create real NFTs on Solana with "create nft" command
4. **Technical Guide**: Explain blockchain concepts, Solana development, DeFi

Be encouraging about collaboration and building together. When multiple users are present, help them connect and work on projects together. Keep responses helpful and community-focused. Vary your responses - don't repeat the same phrases.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    const aiResponse = data.choices[0]?.message?.content || 'I can help you with questions or create NFTs on Solana. What would you like to do?';
    
    console.log('Sending response:', aiResponse);
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return error so client uses fallbacks
    res.status(500).json({ error: 'API unavailable - using fallbacks' });
  }
}