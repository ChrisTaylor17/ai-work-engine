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
            content: `You are an AI assistant that creates real blockchain assets on Solana AND can help with any content creation or questions. You have two main capabilities:

1. **Content Creation**: Write whitepapers, documentation, explanations, code, articles, etc.
2. **Blockchain Powers**: Create real assets on Solana with commands like "create nft", "create project", "mint art"

Be helpful and knowledgeable about any topic. When users ask for content like whitepapers, business plans, technical docs, etc., create comprehensive, well-structured content.

For blockchain assets, explain that they're real and stored permanently on Solana. Be accurate about technical details - current NFTs are SPL tokens with NFT structure (0 decimals, supply=1) but lack Metaplex metadata for wallet display.

Use appropriate formatting with headers, bullet points, and emojis. Keep responses engaging but informative.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I had trouble processing that.';

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}