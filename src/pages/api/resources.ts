import { NextApiRequest, NextApiResponse } from 'next';
import { getResources, deleteResource, createResource } from '@/lib/sqlite';
import { Resource } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const resources = await getResources();
      res.status(200).json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  } else if (req.method === 'POST') {
    try {
      const resourceData = req.body as Omit<Resource, 'id'>;

      // Validate required fields
      if (!resourceData.title || !resourceData.description || !resourceData.url || !resourceData.resourceType) {
        return res.status(400).json({ error: 'Title, description, URL, and resource type are required' });
      }

      const newResource = await createResource(resourceData);

      if (!newResource) {
        return res.status(500).json({ error: 'Failed to create resource' });
      }

      res.status(201).json(newResource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Resource ID is required' });
      }

      const success = await deleteResource(id);

      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: 'Resource not found or could not be deleted' });
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
