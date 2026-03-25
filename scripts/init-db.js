const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function init() {
  console.log('Connecting to MySQL...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'smartpersona_db'
    });

    console.log('Connected! Creating tables...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('User', 'Admin') DEFAULT 'User',
        status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id VARCHAR(50) PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        template VARCHAR(100) NOT NULL,
        status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
        views INT DEFAULT 0,
        downloads INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Tables created successfully. Seeding data...');

    // Clear existing data (optional, for fresh sandbox)
    await connection.query('DELETE FROM resumes');
    await connection.query('DELETE FROM users');

    // Insert dummy users
    const [userResult] = await connection.query(`
      INSERT INTO users (name, email, role, status) VALUES 
      ('John Doe', 'john@example.com', 'User', 'Active'),
      ('Jane Smith', 'jane@example.com', 'Admin', 'Active'),
      ('Elon Musk', 'elon@example.com', 'User', 'Suspended'),
      ('Mark Zuckerberg', 'mark@example.com', 'User', 'Inactive')
    `);

    const firstUserId = userResult.insertId;

    // Insert dummy resumes
    await connection.query(`
      INSERT INTO resumes (id, user_id, title, template, status, views, downloads) VALUES 
      ('RES-001', ?, 'Software Engineer Resume', 'Modern UX', 'Published', 150, 45),
      ('RES-002', ?, 'Marketing Director CV', 'Professional', 'Draft', 0, 0),
      ('RES-003', ?, 'Data Scientist Profile', 'Minimalist', 'Published', 320, 110)
    `, [firstUserId, firstUserId + 1, firstUserId + 1]);

    console.log('Dummy data seeded successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

init();
