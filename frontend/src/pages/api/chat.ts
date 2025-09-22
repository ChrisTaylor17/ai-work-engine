import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

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
            content: `You are CONSILIENCE, an AI assistant that helps people connect and be productive. You learn about users and introduce them to others with similar interests. Be conversational, helpful, and focus on building meaningful connections between people.

${context ? `Context about users: ${context}` : ''}`
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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'I can help you connect with others and be productive!';

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Smart fallback based on message content
    const lower = message.toLowerCase();
    let fallback = '';
    
    if (lower.includes('introduce') || lower.includes('meet')) {
      fallback = 'I help connect people with similar interests! Tell me about yourself and what you\'re working on, and I\'ll help you find others to collaborate with.';
    } else if (lower.includes('hello') || lower.includes('hi')) {
      fallback = 'Hello! I\'m CONSILIENCE, your AI connector. I learn about you and help you meet like-minded people. What are you interested in?';
    } else {
      fallback = 'I\'m here to help you connect with others and be productive. What would you like to explore?';
    }
    
    res.status(200).json({ response: fallback });
  }
}