import { NextApiRequest, NextApiResponse } from 'next';
import { MikrotikAPI } from '@/lib/mikrotik';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mikrotik = new MikrotikAPI();

  try {
    if (req.method === 'GET') {
      const sessions = await mikrotik.getActiveSessions();
      res.status(200).json(sessions);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      await mikrotik.terminateSession(id as string);
      res.status(200).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}