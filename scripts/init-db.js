// scripts/init-db.js
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// This file path should be consistent with the one in src/lib/db.ts
const dbPath = path.join(dataDir, 'connect-plus.db');

async function initDatabase() {
  console.log('Initializing database...');
  
  // Initialize SQLite database
  const Database = require('better-sqlite3');
  const db = new Database(dbPath, { verbose: console.log });
  
  // Create tables
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
  
  // Create admin user if it doesn't exist
  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');
  
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  
  // Check if admin user exists
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').get(adminEmail);
  
  if (!adminExists || adminExists.count === 0) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, adminEmail, hashedPassword, now, now);
    
    console.log(`Created default admin user: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log('Admin user already exists');
  }
  
  console.log('Database initialization complete!');
  console.log('Database path:', dbPath);
}

initDatabase().catch(console.error);
