import { NextApiRequest, NextApiResponse } from 'next';
import { MikrotikAPI } from '@/lib/mikrotik';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mikrotik = new MikrotikAPI();

  try {
    if (req.method === 'GET') {
      const users = await mikrotik.getUsers();
      res.status(200).json(users);
    } else if (req.method === 'POST') {
      const { username, password, profile } = req.body;
      await mikrotik.createUserSession(username, password, profile);
      res.status(201).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}