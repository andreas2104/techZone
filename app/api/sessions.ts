import { MikrotikAPI } from '@/lib/mikrotik';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config = {
    host: process.env.MIKROTIK_HOST || '',
    user: process.env.MIKROTIK_USER || '',
    password: process.env.MIKROTIK_PASSWORD || '',
    port: parseInt(process.env.MIKROTIK_PORT || '8728'),
    secure: process.env.MIKROTIK_SSL === 'true'
  };

  const api = new MikrotikAPI(config);

  try {
    if (req.method === 'GET') {
      const sessions = await api.getSessions();
      res.status(200).json(sessions);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      await api.terminateSession(id as string);
      res.status(200).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: unknown) {
    console.error('eror', error);
    res.status(500).json({ error: 'API request failed' });
  }
}