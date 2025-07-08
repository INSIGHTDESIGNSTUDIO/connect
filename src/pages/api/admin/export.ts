import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getResources, getRoles, getNeeds, listUsers } from '@/lib/sqlite';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { type } = req.query;

    // Export specific type or all data
    switch (type) {
      case 'resources':
        const resources = await getResources();
        return res.status(200).json({
          type: 'resources',
          data: resources,
          exportedAt: new Date().toISOString(),
          count: resources.length
        });

      case 'roles':
        const roles = await getRoles();
        return res.status(200).json({
          type: 'roles',
          data: roles,
          exportedAt: new Date().toISOString(),
          count: roles.length
        });

      case 'needs':
        const needs = await getNeeds();
        return res.status(200).json({
          type: 'needs',
          data: needs,
          exportedAt: new Date().toISOString(),
          count: needs.length
        });

      case 'users':
        const users = listUsers();
        return res.status(200).json({
          type: 'users',
          data: users,
          exportedAt: new Date().toISOString(),
          count: users.length
        });

      default:
        // Export all data
        const [allResources, allRoles, allNeeds, allUsers] = await Promise.all([
          getResources(),
          getRoles(),
          getNeeds(),
          Promise.resolve(listUsers())
        ]);

        return res.status(200).json({
          type: 'full',
          data: {
            resources: allResources,
            roles: allRoles,
            needs: allNeeds,
            users: allUsers
          },
          exportedAt: new Date().toISOString(),
          counts: {
            resources: allResources.length,
            roles: allRoles.length,
            needs: allNeeds.length,
            users: allUsers.length
          }
        });
    }
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ 
      message: 'Export failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}