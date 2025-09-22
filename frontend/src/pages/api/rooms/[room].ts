import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory storage for room messages
const roomMessages: { [key: string]: any[] } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { room } = req.query;
  const roomKey = room as string;

  if (req.method === 'GET') {
    // Get messages for room
    const messages = roomMessages[roomKey] || [];
    res.status(200).json({ messages });
  } else if (req.method === 'POST') {
    // Add message to room
    const { message } = req.body;
    
    if (!roomMessages[roomKey]) {
      roomMessages[roomKey] = [];
    }
    
    roomMessages[roomKey].push(message);
    
    // Keep only last 100 messages
    if (roomMessages[roomKey].length > 100) {
      roomMessages[roomKey] = roomMessages[roomKey].slice(-100);
    }
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}