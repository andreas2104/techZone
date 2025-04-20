import { NextApiRequest, NextApiResponse } from 'next';
import { MikrotikAPI } from '@/lib/mikrotik';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, profileName } = req.body;

    if (!username || !password || !profileName) {
      return res.status(400).json({ 
        message: 'Missing required fields: username, password, and profileName are required' 
      });
    }

    const mikrotikAPI = new MikrotikAPI();
    const session = await mikrotikAPI.createUserSession(username, password, profileName);

    return res.status(201).json({ 
      success: true, 
      message: 'User session created successfully', 
      session 
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to create user session', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
