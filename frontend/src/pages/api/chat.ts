import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
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
            content: `You are CONSILIENCE - an AI that creates real NFTs on Solana blockchain and can discuss any topic.

You have two main capabilities:
1. **General AI**: Answer questions, create content, have conversations about any topic
2. **NFT Creation**: Create real NFTs on Solana with "create nft" command

Be conversational, helpful, and knowledgeable. When users want NFTs, explain they need to connect their wallet and use "create nft". 

Keep responses concise but informative. Use minimal formatting - no excessive emojis or markdown.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I can help you with questions or create NFTs on Solana. What would you like to do?';

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}