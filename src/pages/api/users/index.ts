import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, listUsers } from '@/lib/sqlite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the user is authenticated as admin
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: 'You must be signed in to access this endpoint' });
  }
  
  if (req.method === 'GET') {
    try {
      const users = listUsers();
      // Return only safe user data (no passwords)
      const safeUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }));
      
      res.status(200).json(safeUsers);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Failed to list users' });
    }
  } else if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Validate password strength (minimum 8 characters)
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      
      // Create the user
      const user = await createUser(email, password);
      
      if (!user) {
        return res.status(409).json({ error: 'User already exists or could not be created' });
      }
      
      // Return the user without password
      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}