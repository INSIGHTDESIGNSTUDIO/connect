// scripts/reset-admin-password.js
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// This file path should be consistent with the one in src/lib/db.ts
const dbPath = path.join(dataDir, 'connect-plus.db');

async function resetAdminPassword() {
  console.log('Resetting admin password...');
  
  // Initialize SQLite database
  const Database = require('better-sqlite3');
  const db = new Database(dbPath, { verbose: console.log });
  
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  
  // Check if admin user exists
  const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  
  if (!adminUser) {
    console.log('Admin user not found. Creating new admin user...');
    
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (id, email, password, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, adminEmail, hashedPassword, now, now);
    
    console.log(`Created admin user: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log('Admin user found. Updating password...');
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const now = new Date().toISOString();
    
    db.prepare(`
      UPDATE users
      SET password = ?, updatedAt = ?
      WHERE email = ?
    `).run(hashedPassword, now, adminEmail);
    
    console.log(`Updated admin user password: ${adminEmail} (password: ${adminPassword})`);
  }
  
  // Verify the user exists and password is correct
  const updatedUser = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
  if (updatedUser) {
    const passwordMatch = await bcrypt.compare(adminPassword, updatedUser.password);
    console.log('Password verification:', passwordMatch ? 'SUCCESS' : 'FAILED');
  }
  
  console.log('Admin password reset complete!');
}

resetAdminPassword().catch(console.error);
