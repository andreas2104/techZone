import { NextApiRequest, NextApiResponse } from 'next';
import { MikrotikAPI } from '@/lib/mikrotik';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mikrotikAPI = new MikrotikAPI();

  if (req.method === 'GET') {
    try {
      const sessions = await mikrotikAPI.getActiveSessions();
      return res.status(200).json({ success: true, sessions });
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get sessions', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Session ID is required' });
      }
      
      const result = await mikrotikAPI.terminateSession(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to terminate session', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}