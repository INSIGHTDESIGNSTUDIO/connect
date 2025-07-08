import { NextApiRequest, NextApiResponse } from 'next';
import { getRoles, deleteRole, createRole } from '@/lib/sqlite';
import { AdminRole } from '@/types/roles';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET request - fetch all roles
  if (req.method === 'GET') {
    try {
      const roles = await getRoles();
      res.status(200).json(roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ error: 'Failed to fetch roles' });
    }
  } 
  // POST request - create a new role
  else if (req.method === 'POST') {
    try {
      const roleData = req.body as Omit<AdminRole, 'id'>;
      
      // Validate required fields
      if (!roleData.name) {
        return res.status(400).json({ error: 'Role name is required' });
      }
      
      // Add timestamps if not provided
      if (!roleData.createdAt) {
        roleData.createdAt = new Date().toISOString();
      }
      if (!roleData.updatedAt) {
        roleData.updatedAt = new Date().toISOString();
      }
      
      const newRole = await createRole(roleData);
      
      if (!newRole) {
        return res.status(500).json({ error: 'Failed to create role' });
      }
      
      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'Failed to create role' });
    }
  }
  // DELETE request - delete a role
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Role ID is required' });
    }
    
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
  } 
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
