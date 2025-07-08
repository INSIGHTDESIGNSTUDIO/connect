import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (typeof window === 'undefined' && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// This file path should be consistent and accessible to VS Code SQLite extension
export const dbPath = path.join(dataDir, 'connect-plus.db');

// Define the Database type without importing better-sqlite3 directly
type Database = any;

let db: Database;

// Singleton pattern to reuse the database connection
export function getDatabase() {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot use SQLite on the client side');
  }
  
  if (!db) {
    // Only import in server context
    const SQLite = require('better-sqlite3');
    db = new SQLite(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined });
    initializeDatabase(db);
  }
  return db;
}

// Initialize database schema if needed
function initializeDatabase(db: Database) {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT,
      roles TEXT, -- Storing as JSON string
      needs TEXT, -- Storing as JSON string
      tags TEXT, -- Storing as JSON string
      featured INTEGER DEFAULT 0,
      updatedAt TEXT NOT NULL,
      resourceType TEXT NOT NULL,
      actionText TEXT DEFAULT 'View Resource'
    );
    
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
    
    CREATE TABLE IF NOT EXISTS needs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL,
      roles TEXT, -- Storing as JSON string
      createdAt TEXT,
      updatedAt TEXT
    );
    
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
  
  console.log('Database initialized at:', dbPath);
}
