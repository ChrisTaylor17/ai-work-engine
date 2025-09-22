import { NextApiRequest, NextApiResponse } from 'next';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: number;
  nft?: any;
  action?: string;
}

// In-memory storage (use database in production)
let messages: Message[] = [];
let users: Set<string> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return messages and active users
    res.status(200).json({ 
      messages: messages.slice(-50), // Last 50 messages
      users: Array.from(users)
    });
  } else if (req.method === 'POST') {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Add message
    messages.push(message);
    users.add(message.user);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    // Clean up old users (remove after 5 minutes of inactivity)
    setTimeout(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const recentUsers = new Set(
        messages
          .filter(m => m.timestamp > fiveMinutesAgo)
          .map(m => m.user)
      );
      users = recentUsers;
    }, 1000);
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}