import { NextApiRequest, NextApiResponse } from 'next';
import { getNeedById, updateNeed, deleteNeed } from '@/lib/sqlite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Need ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const need = await getNeedById(id);
      
      if (!need) {
        return res.status(404).json({ error: 'Need not found' });
      }
      
      res.status(200).json(need);
    } catch (error) {
      console.error('Error fetching need:', error);
      res.status(500).json({ error: 'Failed to fetch need' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updates = req.body;
      
      const updatedNeed = await updateNeed(id, updates);
      
      if (!updatedNeed) {
        return res.status(404).json({ error: 'Need not found or could not be updated' });
      }
      
      res.status(200).json(updatedNeed);
    } catch (error) {
      console.error('Error updating need:', error);
      res.status(500).json({ error: 'Failed to update need' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await deleteNeed(id);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: 'Need not found or could not be deleted' });
      }
    } catch (error) {
      console.error('Error deleting need:', error);
      res.status(500).json({ error: 'Failed to delete need' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}