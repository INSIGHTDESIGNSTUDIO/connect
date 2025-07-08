/**
 * Types for the admin needs management system
 */
export interface AdminNeed {
  /**
   * Unique identifier for the need, typically a UUID from Supabase
   */
  id: string;
  
  /**
   * Display name/heading of the need
   * Examples: "Teaching Resources", "Unit Development", etc.
   */
  name: string;
  
  /**
   * Descriptive text explaining what this need represents
   */
  description: string;
  
  /**
   * Name of the Lucide icon to use for this need
   * This is the component name from the lucide-react package
   * Example: "BookOpen", "FileText", "GraduationCap"
   */
  icon: string;
  
  /**
   * Array of role IDs that this need aligns with
   */
  roles: string[];
  
  /**
   * ISO timestamp of when the need was created
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   */
  createdAt: string;
  
  /**
   * ISO timestamp of when the need was last modified
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   */
  updatedAt: string;
}