import { NextApiRequest, NextApiResponse } from 'next';

// Simple in-memory storage for user profiles
const userProfiles: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Get all profiles
    res.status(200).json({ profiles: userProfiles });
  } else if (req.method === 'POST') {
    // Add or update profile
    const { profile } = req.body;
    
    if (!profile) {
      return res.status(400).json({ error: 'Profile is required' });
    }
    
    // Remove existing profile for this user
    const existingIndex = userProfiles.findIndex(p => p.id === profile.id);
    if (existingIndex !== -1) {
      userProfiles.splice(existingIndex, 1);
    }
    
    // Add new profile
    userProfiles.push(profile);
    
    // Keep only last 50 profiles
    if (userProfiles.length > 50) {
      userProfiles.splice(0, userProfiles.length - 50);
    }
    
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}