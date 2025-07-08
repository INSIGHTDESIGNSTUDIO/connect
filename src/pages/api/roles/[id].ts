import { NextApiRequest, NextApiResponse } from 'next';
import { getRoleById, updateRole, deleteRole } from '@/lib/sqlite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const role = await getRoleById(id);
      
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      
      res.status(200).json(role);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({ error: 'Failed to fetch role' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updates = req.body;
      
      const updatedRole = await updateRole(id, updates);
      
      if (!updatedRole) {
        return res.status(404).json({ error: 'Role not found or could not be updated' });
      }
      
      res.status(200).json(updatedRole);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'Failed to update role' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await deleteRole(id);
      
      if (success) {
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: 'Role not found or could not be deleted' });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Failed to delete role' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}