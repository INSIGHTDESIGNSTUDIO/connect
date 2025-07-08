/**
 * Types for the admin role management system
 */
export interface AdminRole {
  /**
   * Unique identifier for the role, typically a UUID from Supabase
   */
  id: string;
  
  /**
   * Display name of the role
   * Examples: "HE Lecturer", "VET/TAFE Lecturer", etc.
   */
  name: string;
  
  /**
   * Descriptive text explaining what this role represents
   */
  description: string;
  
  /**
   * Name of the Lucide icon to use for this role
   * This is the component name from the lucide-react package
   * Example: "User", "BookOpen", "GraduationCap"
   */
  icon: string;
  
  /**
   * ISO timestamp of when the role was created
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   */
  createdAt: string;
  
  /**
   * ISO timestamp of when the role was last modified
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   */
  updatedAt: string;
}