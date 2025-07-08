import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { 
  createResource, 
  createRole, 
  createNeed, 
  createUser,
  updateResource,
  updateRole,
  updateNeed,
  getResourceById,
  getRoleById,
  getNeedById,
  getUserByEmail,
  deleteResource,
  deleteRole,
  deleteNeed,
  deleteUser
} from '@/lib/sqlite';

interface ImportData {
  type: 'resources' | 'roles' | 'needs' | 'users' | 'full';
  data: any;
  overwrite?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { type, data, overwrite = false }: ImportData = req.body;

    if (!type || !data) {
      return res.status(400).json({ message: 'Missing type or data' });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
      details: [] as string[]
    };

    switch (type) {
      case 'resources':
        await importResources(data, overwrite, results);
        break;

      case 'roles':
        await importRoles(data, overwrite, results);
        break;

      case 'needs':
        await importNeeds(data, overwrite, results);
        break;

      case 'users':
        await importUsers(data, overwrite, results);
        break;

      case 'full':
        if (data.resources) await importResources(data.resources, overwrite, results);
        if (data.roles) await importRoles(data.roles, overwrite, results);
        if (data.needs) await importNeeds(data.needs, overwrite, results);
        if (data.users) await importUsers(data.users, overwrite, results);
        break;

      default:
        return res.status(400).json({ message: 'Invalid import type' });
    }

    return res.status(200).json({
      message: 'Import completed',
      results,
      importedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ 
      message: 'Import failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function importResources(resources: any[], overwrite: boolean, results: any) {
  if (!Array.isArray(resources)) {
    results.errors.push('Resources data must be an array');
    return;
  }

  for (const resource of resources) {
    try {
      // Validate required fields
      if (!resource.title || !resource.description || !resource.url || !resource.resourceType) {
        results.errors.push(`Invalid resource data: missing required fields`);
        continue;
      }

      // Check if resource exists (by ID if provided, otherwise by title)
      let existingResource = null;
      if (resource.id) {
        existingResource = await getResourceById(resource.id);
      }

      if (existingResource) {
        if (overwrite) {
          const updated = await updateResource(resource.id, {
            title: resource.title,
            description: resource.description,
            url: resource.url,
            icon: resource.icon,
            roles: resource.roles || [],
            needs: resource.needs || [],
            tags: resource.tags || [],
            featured: resource.featured || false,
            updatedAt: new Date().toISOString(),
            resourceType: resource.resourceType,
            actionText: resource.actionText
          });

          if (updated) {
            results.updated++;
            results.details.push(`Updated resource: ${resource.title}`);
          } else {
            results.errors.push(`Failed to update resource: ${resource.title}`);
          }
        } else {
          results.details.push(`Skipped existing resource: ${resource.title}`);
        }
      } else {
        // Create new resource
        const created = await createResource({
          title: resource.title,
          description: resource.description,
          url: resource.url,
          icon: resource.icon,
          roles: resource.roles || [],
          needs: resource.needs || [],
          tags: resource.tags || [],
          featured: resource.featured || false,
          updatedAt: new Date().toISOString(),
          resourceType: resource.resourceType,
          actionText: resource.actionText || 'View Resource'
        });

        if (created) {
          results.created++;
          results.details.push(`Created resource: ${resource.title}`);
        } else {
          results.errors.push(`Failed to create resource: ${resource.title}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error processing resource: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

async function importRoles(roles: any[], overwrite: boolean, results: any) {
  if (!Array.isArray(roles)) {
    results.errors.push('Roles data must be an array');
    return;
  }

  for (const role of roles) {
    try {
      // Validate required fields
      if (!role.name) {
        results.errors.push(`Invalid role data: missing name`);
        continue;
      }

      let existingRole = null;
      if (role.id) {
        existingRole = await getRoleById(role.id);
      }

      if (existingRole) {
        if (overwrite) {
          const updated = await updateRole(role.id, {
            name: role.name,
            description: role.description,
            icon: role.icon,
            updatedAt: new Date().toISOString()
          });

          if (updated) {
            results.updated++;
            results.details.push(`Updated role: ${role.name}`);
          } else {
            results.errors.push(`Failed to update role: ${role.name}`);
          }
        } else {
          results.details.push(`Skipped existing role: ${role.name}`);
        }
      } else {
        const created = await createRole({
          name: role.name,
          description: role.description,
          icon: role.icon,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        if (created) {
          results.created++;
          results.details.push(`Created role: ${role.name}`);
        } else {
          results.errors.push(`Failed to create role: ${role.name}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error processing role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

async function importNeeds(needs: any[], overwrite: boolean, results: any) {
  if (!Array.isArray(needs)) {
    results.errors.push('Needs data must be an array');
    return;
  }

  for (const need of needs) {
    try {
      // Validate required fields
      if (!need.name || !need.icon) {
        results.errors.push(`Invalid need data: missing required fields`);
        continue;
      }

      let existingNeed = null;
      if (need.id) {
        existingNeed = await getNeedById(need.id);
      }

      if (existingNeed) {
        if (overwrite) {
          const updated = await updateNeed(need.id, {
            name: need.name,
            description: need.description,
            icon: need.icon,
            roles: need.roles || [],
            updatedAt: new Date().toISOString()
          });

          if (updated) {
            results.updated++;
            results.details.push(`Updated need: ${need.name}`);
          } else {
            results.errors.push(`Failed to update need: ${need.name}`);
          }
        } else {
          results.details.push(`Skipped existing need: ${need.name}`);
        }
      } else {
        const created = await createNeed({
          name: need.name,
          description: need.description,
          icon: need.icon,
          roles: need.roles || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        if (created) {
          results.created++;
          results.details.push(`Created need: ${need.name}`);
        } else {
          results.errors.push(`Failed to create need: ${need.name}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error processing need: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

async function importUsers(users: any[], overwrite: boolean, results: any) {
  if (!Array.isArray(users)) {
    results.errors.push('Users data must be an array');
    return;
  }

  for (const user of users) {
    try {
      // Validate required fields
      if (!user.email) {
        results.errors.push(`Invalid user data: missing email`);
        continue;
      }

      // Skip importing users without passwords (security concern)
      if (!user.password && !overwrite) {
        results.details.push(`Skipped user without password: ${user.email}`);
        continue;
      }

      const existingUser = getUserByEmail(user.email);

      if (existingUser) {
        if (overwrite && user.password) {
          // Note: This would require implementing password change functionality
          // For now, we'll skip updating user passwords during import
          results.details.push(`Skipped existing user: ${user.email} (password updates not supported)`);
        } else {
          results.details.push(`Skipped existing user: ${user.email}`);
        }
      } else {
        if (user.password) {
          const created = await createUser(user.email, user.password);

          if (created) {
            results.created++;
            results.details.push(`Created user: ${user.email}`);
          } else {
            results.errors.push(`Failed to create user: ${user.email}`);
          }
        } else {
          results.errors.push(`Cannot create user without password: ${user.email}`);
        }
      }
    } catch (error) {
      results.errors.push(`Error processing user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}