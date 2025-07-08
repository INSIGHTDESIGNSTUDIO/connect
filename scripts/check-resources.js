// scripts/check-resources.js
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// This file path should be consistent with the one in src/lib/db.ts
const dbPath = path.join(dataDir, 'connect-plus.db');

function checkResources() {
  console.log('Checking resources in database...');
  
  // Initialize SQLite database
  const Database = require('better-sqlite3');
  const db = new Database(dbPath, { verbose: console.log });
  
  // Check resources
  const resources = db.prepare('SELECT * FROM resources').all();
  console.log('Resources count:', resources.length);
  
  if (resources.length === 0) {
    console.log('No resources found in the database.');
    
    // Add a sample resource
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO resources (
        id, title, description, url, icon, roles, needs, tags, 
        featured, updatedAt, resourceType, actionText
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      'Sample Resource',
      'This is a sample resource for testing purposes.',
      'https://example.com',
      'FileText',
      JSON.stringify(['HE Lecturer']),
      JSON.stringify(['Unit Development']),
      JSON.stringify(['sample', 'test']),
      0,
      now,
      'Guide',
      'View Resource'
    );
    
    console.log('Added a sample resource.');
  } else {
    console.log('Resources found:');
    resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.title} (${resource.resourceType})`);
    });
  }
}

checkResources();
