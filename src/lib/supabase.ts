// This file is kept for backward compatibility but the app now uses SQLite
// All functionality has been moved to sqlite.ts
import { Resource, UserNeed, UserRole, Role } from '@/types';
import { AdminRole } from '@/types/roles';
import { AdminNeed } from '@/types/needs';
import * as sqliteModule from './sqlite';

// Dummy supabase client for backward compatibility
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: null })
  },
  from: () => ({
    select: () => ({
      order: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase is no longer used') })
        }),
        all: async () => ({ data: null, error: new Error('Supabase is no longer used') })
      })
    }),
    insert: () => ({
      select: async () => ({ data: null, error: new Error('Supabase is no longer used') })
    }),
    update: () => ({
      eq: () => ({
        select: async () => ({ data: null, error: new Error('Supabase is no longer used') })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: new Error('Supabase is no longer used') })
    })
  })
};

// Re-export all functions from sqlite.ts
export const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getNeeds,
  getNeedById,
  createNeed,
  updateNeed,
  deleteNeed,
  mockResources,
  mockRoles,
  mockNeeds
} = sqliteModule;

// Helper function for backward compatibility
export function parseArrayField(field: any): string[] {
  // If it's already an array, return it
  if (Array.isArray(field)) return field;
  
  // If it's a string, try to parse it as JSON
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      // If parsing fails, it might be a single string
      return field ? [field] : [];
    }
  }
  
  // If it's null or undefined
  return [];
}
