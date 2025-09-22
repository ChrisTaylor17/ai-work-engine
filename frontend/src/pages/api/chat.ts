import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== CHAT API CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API Key first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10));

  try {
    console.log('Making OpenAI API call...');
    
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
            content: 'You are CONSILIENCE, an AI assistant that helps people build crypto projects and create real NFTs on Solana. Be conversational, helpful, and encouraging about blockchain development. Keep responses concise but engaging.'
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

    console.log('OpenAI response status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    console.log('OpenAI response data:', data);
    
    const aiResponse = data.choices[0]?.message?.content || 'I can help you build crypto projects!';
    
    console.log('Sending AI response:', aiResponse);
    res.status(200).json({ response: aiResponse });
    
  } catch (error) {
    console.error('=== OPENAI API FAILED ===');
    console.error('Error:', error);
    
    // Fallback response
    const fallback = `I'm having trouble connecting to my full AI capabilities right now, but I can still help! What crypto project are you working on?`;
    res.status(200).json({ response: fallback });
  }
}