// src/lib/sqlite.ts
import { Resource, UserNeed, UserRole, Role } from '@/types';
import { AdminRole } from '@/types/roles';
import { AdminNeed } from '@/types/needs';
import { v4 as uuidv4 } from 'uuid';

// Helper function to parse JSON strings into arrays
function parseArrayField(field: any): string[] {
  if (Array.isArray(field)) return field;
  
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return field ? [field] : [];
    }
  }
  
  return [];
}

// Get database instance - this is a function to avoid importing
// better-sqlite3 on the client side
function getDb() {
  // Dynamic import to avoid importing on client side
  const { getDatabase } = require('./db');
  return getDatabase();
}

// Helper function to get bcrypt - only import on server side
function getBcrypt() {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot use bcrypt on the client side');
  }
  return require('bcryptjs');
}

// ==== RESOURCES ====

// Get all resources
export async function getResources(): Promise<Resource[]> {
  try {
    const db = getDb();
    const resources = db.prepare('SELECT * FROM resources ORDER BY updatedAt DESC').all();
    
    return resources.map((item: any) => ({
      ...item,
      roles: parseArrayField(item.roles),
      needs: parseArrayField(item.needs),
      tags: parseArrayField(item.tags),
      featured: Boolean(item.featured),
    }));
  } catch (error) {
    console.error('SQLite fetch error:', error);
    return [];
  }
}

// Get a resource by ID
export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const db = getDb();
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    if (!resource) return null;
    
    return {
      ...resource,
      roles: parseArrayField(resource.roles),
      needs: parseArrayField(resource.needs),
      tags: parseArrayField(resource.tags),
      featured: Boolean(resource.featured),
    };
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

// Create a new resource
export async function createResource(resourceData: Omit<Resource, 'id'>): Promise<Resource | null> {
  try {
    const db = getDb();
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO resources (
        id, title, description, url, icon, roles, needs, tags, 
        featured, updatedAt, resourceType, actionText
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      resourceData.title,
      resourceData.description,
      resourceData.url,
      resourceData.icon,
      JSON.stringify(resourceData.roles || []),
      JSON.stringify(resourceData.needs || []),
      JSON.stringify(resourceData.tags || []),
      resourceData.featured ? 1 : 0,
      resourceData.updatedAt,
      resourceData.resourceType,
      resourceData.actionText || 'View Resource'
    );
    
    return {
      id,
      ...resourceData,
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return null;
  }
}

// Update a resource
export async function updateResource(
  id: string,
  updates: Partial<Omit<Resource, 'roles' | 'needs' | 'resourceType'>> & {
    roles?: string[] | UserRole[];
    needs?: string[] | UserNeed[];
    tags?: string[];
    resourceType?: string;
  }
): Promise<Resource | null> {
  try {
    const db = getDb();
    const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
    
    if (!resource) return null;
    
    // Update only provided fields
    const updatedResource = {
      ...resource,
      ...updates,
      roles: updates.roles ? JSON.stringify(updates.roles) : resource.roles,
      needs: updates.needs ? JSON.stringify(updates.needs) : resource.needs,
      tags: updates.tags ? JSON.stringify(updates.tags) : resource.tags,
      featured: updates.featured !== undefined ? Number(updates.featured) : resource.featured
    };
    
    db.prepare(`
      UPDATE resources
      SET title = ?, description = ?, url = ?, icon = ?, roles = ?, 
          needs = ?, tags = ?, featured = ?, updatedAt = ?, 
          resourceType = ?, actionText = ?
      WHERE id = ?
    `).run(
      updatedResource.title,
      updatedResource.description,
      updatedResource.url,
      updatedResource.icon,
      updatedResource.roles,
      updatedResource.needs,
      updatedResource.tags,
      updatedResource.featured,
      updatedResource.updatedAt,
      updatedResource.resourceType,
      updatedResource.actionText,
      id
    );
    
    return {
      ...updatedResource,
      roles: parseArrayField(updatedResource.roles),
      needs: parseArrayField(updatedResource.needs),
      tags: parseArrayField(updatedResource.tags),
      featured: Boolean(updatedResource.featured),
    };
  } catch (error) {
    console.error('Error updating resource:', error);
    return null;
  }
}

// Delete a resource
export async function deleteResource(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM resources WHERE id = ?').run(id);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting resource:', error);
    return false;
  }
}

// ==== ROLES ====

// Get all roles
export async function getRoles(): Promise<Role[]> {
  try {
    const db = getDb();
    const roles = db.prepare('SELECT * FROM roles ORDER BY name').all();
    
    return roles;
  } catch (error) {
    console.error('SQLite fetch error:', error);
    return [];
  }
}

// Get a role by ID
export async function getRoleById(id: string): Promise<Role | null> {
  try {
    const db = getDb();
    const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
    
    return role || null;
  } catch (error) {
    console.error('Error fetching role:', error);
    return null;
  }
}

// Create a new role
export async function createRole(roleData: Omit<AdminRole, 'id'>): Promise<AdminRole | null> {
  try {
    const db = getDb();
    const id = uuidv4();
    
    db.prepare(`
      INSERT INTO roles (id, name, description, icon, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      roleData.name,
      roleData.description,
      roleData.icon,
      roleData.createdAt,
      roleData.updatedAt
    );
    
    return {
      id,
      ...roleData,
    };
  } catch (error) {
    console.error('Error creating role:', error);
    return null;
  }
}

// Update a role
export async function updateRole(
  id: string,
  updates: Partial<Omit<Role, 'id'>>
): Promise<Role | null> {
  try {
    const db = getDb();
    const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
    
    if (!role) return null;
    
    // Update only provided fields
    const updatedRole = {
      ...role,
      ...updates,
    };
    
    db.prepare(`
      UPDATE roles
      SET name = ?, description = ?, icon = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updatedRole.name,
      updatedRole.description,
      updatedRole.icon,
      updatedRole.updatedAt,
      id
    );
    
    return updatedRole;
  } catch (error) {
    console.error('Error updating role:', error);
    return null;
  }
}

// Delete a role
export async function deleteRole(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM roles WHERE id = ?').run(id);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting role:', error);
    return false;
  }
}

// ==== NEEDS ====

// Get all needs
export async function getNeeds(): Promise<AdminNeed[]> {
  try {
    const db = getDb();
    const needs = db.prepare('SELECT * FROM needs ORDER BY name').all();
    
    return needs.map((item: any) => ({
      ...item,
      roles: parseArrayField(item.roles),
    }));
  } catch (error) {
    console.error('SQLite fetch error:', error);
    return [];
  }
}

// Get a need by ID
export async function getNeedById(id: string): Promise<AdminNeed | null> {
  try {
    const db = getDb();
    const need = db.prepare('SELECT * FROM needs WHERE id = ?').get(id);
    
    if (!need) return null;
    
    return {
      ...need,
      roles: parseArrayField(need.roles),
    };
  } catch (error) {
    console.error('Error fetching need:', error);
    return null;
  }
}

// Create a new need
export async function createNeed(needData: Omit<AdminNeed, 'id'>): Promise<AdminNeed | null> {
  try {
    const db = getDb();
    const id = uuidv4();
    const roles = JSON.stringify(needData.roles || []);
    
    db.prepare(`
      INSERT INTO needs (id, name, description, icon, roles, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      needData.name,
      needData.description,
      needData.icon,
      roles,
      needData.createdAt,
      needData.updatedAt
    );
    
    return {
      id,
      ...needData,
    };
  } catch (error) {
    console.error('Error creating need:', error);
    return null;
  }
}

// Update a need
export async function updateNeed(
  id: string,
  updates: Partial<Omit<AdminNeed, 'id'>>
): Promise<AdminNeed | null> {
  try {
    const db = getDb();
    const need = db.prepare('SELECT * FROM needs WHERE id = ?').get(id);
    
    if (!need) return null;
    
    // Update only provided fields
    const updatedNeed = {
      ...need,
      ...updates,
      roles: updates.roles ? JSON.stringify(updates.roles) : need.roles
    };
    
    db.prepare(`
      UPDATE needs
      SET name = ?, description = ?, icon = ?, roles = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updatedNeed.name,
      updatedNeed.description,
      updatedNeed.icon,
      updatedNeed.roles,
      updatedNeed.updatedAt,
      id
    );
    
    return {
      ...updatedNeed,
      roles: parseArrayField(updatedNeed.roles),
    };
  } catch (error) {
    console.error('Error updating need:', error);
    return null;
  }
}

// Delete a need
export async function deleteNeed(id: string): Promise<boolean> {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM needs WHERE id = ?').run(id);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting need:', error);
    return false;
  }
}

// ==== USERS ====

// Create a new user
export async function createUser(email: string, password: string): Promise<{ id: string; email: string } | null> {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot create user on the client side');
    }
    
    const db = getDb();
    const bcrypt = getBcrypt();
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return null; // User already exists
    }
    
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    
    // Insert new user
    db.prepare(`
      INSERT INTO users (id, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, hashedPassword, now, now);
    
    return { id, email };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Get a user by email (for authentication)
export function getUserByEmail(email: string): { id: string; email: string; password: string } | null {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot get user by email on the client side');
    }
    
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    return user || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Change user password
export async function changeUserPassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot change password on the client side');
    }
    
    const db = getDb();
    const bcrypt = getBcrypt();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();
    
    const result = db.prepare('UPDATE users SET password = ?, updatedAt = ? WHERE id = ?')
      .run(hashedPassword, now, userId);
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}

// Seed an admin user if none exists
export async function seedAdminUser(adminEmail: string = 'admin@example.com', adminPassword: string = 'admin123'): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot seed admin user on the client side');
    }
    
    const db = getDb();
    const adminExists = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    if (!adminExists || adminExists.count === 0) {
      // Create default admin user
      await createUser(adminEmail, adminPassword);
      console.log(`Created default admin user: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// List all users (for admin panel)
export function listUsers(): { id: string; email: string; createdAt: string }[] {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot list users on the client side');
    }
    
    const db = getDb();
    const users = db.prepare('SELECT id, email, createdAt FROM users ORDER BY createdAt DESC').all();
    return users || [];
  } catch (error) {
    console.error('Error listing users:', error);
    return [];
  }
}

// Delete a user
export function deleteUser(userId: string): boolean {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Cannot delete user on the client side');
    }
    
    const db = getDb();
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

// Mock data for fallback if needed
export const mockResources: Resource[] = [
  {
    id: 'mock-1',
    title: 'Sample Resource',
    description: 'This is a mock resource shown if SQLite fetch fails.',
    url: 'https://example.com',
    resourceType: 'Guide',
    icon: 'FileText',
    roles: ['HE Lecturer'],
    needs: ['Unit Development'],
    tags: ['mock', 'sample'],
    featured: false,
    updatedAt: '2025-01-01',
  },
];

export const mockRoles: Role[] = [
  {
    id: 'mock-1',
    name: 'HE Lecturer',
    description: 'Teaching in higher education institutions',
    icon: 'BookOpen',
  },
  {
    id: 'mock-2',
    name: 'VET/TAFE Lecturer',
    description: 'Teaching in vocational education settings',
    icon: 'School',
  },
  {
    id: 'mock-3',
    name: 'Unit Coordinator',
    description: 'Coordinating and managing educational units',
    icon: 'Briefcase',
  },
  {
    id: 'mock-4',
    name: 'Professional Staff',
    description: 'Supporting educational delivery and operations',
    icon: 'Users',
  },
  {
    id: 'mock-5',
    name: 'New to Teaching',
    description: 'Recently started teaching in any setting',
    icon: 'GraduationCap',
  },
];

export const mockNeeds: AdminNeed[] = [
  {
    id: 'mock-1',
    name: 'Teaching Resources',
    description: 'Materials and guides for classroom teaching',
    icon: 'BookOpen',
    roles: ['mock-1', 'mock-2', 'mock-5'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 'mock-2',
    name: 'Unit Development',
    description: 'Resources for developing and planning course units',
    icon: 'FileText',
    roles: ['mock-1', 'mock-3'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 'mock-3',
    name: 'Student Support',
    description: 'Resources for helping students succeed',
    icon: 'Users',
    roles: ['mock-1', 'mock-2', 'mock-4'],
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
];
