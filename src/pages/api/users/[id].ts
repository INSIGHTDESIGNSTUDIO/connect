import { NextApiRequest, NextApiResponse } from 'next';
import { changeUserPassword, deleteUser } from '@/lib/sqlite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the user is authenticated as admin
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'You must be signed in to access this endpoint' });
  }
  
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  // PUT/PATCH - Update user password
  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
      
      // Validate password strength (minimum 8 characters)
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      const success = await changeUserPassword(id, password);
      
      if (!success) {
        return res.status(404).json({ error: 'User not found or could not be updated' });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating user password:', error);
      res.status(500).json({ error: 'Failed to update user password' });
    }
  } 
  // DELETE - Delete a user
  else if (req.method === 'DELETE') {
    try {
      // Don't allow deleting the current user
      if (session.user.id === id) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
      }
      
      const success = deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ error: 'User not found or could not be deleted' });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}