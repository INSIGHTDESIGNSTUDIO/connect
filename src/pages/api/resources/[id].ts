import { NextApiRequest, NextApiResponse } from 'next';
import { getResourceById, updateResource } from '@/lib/sqlite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Resource ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const resource = await getResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      res.status(200).json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ error: 'Failed to fetch resource' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updates = req.body;
      
      const updatedResource = await updateResource(id, updates);
      
      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found or could not be updated' });
      }
      
      res.status(200).json(updatedResource);
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}