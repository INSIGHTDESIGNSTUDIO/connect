export type UserRole = string;

export interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

// Changed from a union type to string to allow for dynamic needs from the database
export type UserNeed = string;

// src/types/index.ts
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  roles: UserRole[];
  needs: UserNeed[];
  tags: string[];
  featured: boolean;
  updatedAt: string;
  /**
   * Category or type of the resource (e.g., Guide, Video, Template, etc.)
   */
  resourceType: string;
  /**
   * Custom action text for the resource link (e.g., "Go to", "Speak With")
   * Defaults to "View Resource" if not provided
   */
  actionText?: string;
}

/**
 * Admin-editable type definitions for resource types (categories)
 */
export interface AdminResourceType {
  /** Unique identifier, typically UUID */
  id: string;
  /** Display name of the resource type */
  name: string;
  /** Description or notes about this resource type */
  description: string;
  /** Timestamp when created */
  createdAt?: string;
  /** Timestamp when last updated */
  updatedAt?: string;
}