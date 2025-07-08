/**
 * Represents an admin user in the application
 */
export interface AdminUser {
  /** Unique identifier, typically UUID */
  id: string;
  /** User's email address, used for login */
  email: string;
  /** User's hashed password (never exposed to client) */
  password?: string;
  /** Whether the user has admin privileges */
  isAdmin?: boolean;
  /** Timestamp when the user was created */
  createdAt: string;
  /** Timestamp when the user was last updated */
  updatedAt: string;
}

/**
 * Create user request data (omits id and timestamps)
 */
export type CreateUserRequest = {
  email: string;
  password: string;
  isAdmin?: boolean;
};

/**
 * User data that is safe to return to the client (omits password)
 */
export type SafeUser = Omit<AdminUser, 'password'>;