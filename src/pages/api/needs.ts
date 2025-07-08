import { NextApiRequest, NextApiResponse } from 'next';
import { getNeeds, createNeed } from '@/lib/sqlite';
import { AdminNeed } from '@/types/needs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const needs = await getNeeds();
      res.status(200).json(needs);
    } catch (error) {
      console.error('Error fetching needs:', error);
      res.status(500).json({ error: 'Failed to fetch needs' });
    }
  } else if (req.method === 'POST') {
    try {
      const needData = req.body as Omit<AdminNeed, 'id'>;

      // Validate required fields
      if (!needData.name || !needData.icon) {
        return res.status(400).json({ error: 'Need name and icon are required' });
      }

      // Add timestamps if not provided
      if (!needData.createdAt) {
        needData.createdAt = new Date().toISOString();
      }
      if (!needData.updatedAt) {
        needData.updatedAt = new Date().toISOString();
      }

      const newNeed = await createNeed(needData);

      if (!newNeed) {
        return res.status(500).json({ error: 'Failed to create need' });
      }

      res.status(201).json(newNeed);
    } catch (error) {
      console.error('Error creating need:', error);
      res.status(500).json({ error: 'Failed to create need' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
