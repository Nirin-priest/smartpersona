import mysql from 'mysql2/promise';

// Create a connection pool that can be reused across different requests
// Ensure you have these environment variables set in your .env.local file
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smartpersona_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

/**
 * Example MySQL Schema expected for this admin panel:
 * 
 * CREATE TABLE users (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   role ENUM('User', 'Admin') DEFAULT 'User',
 *   status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 * 
 * CREATE TABLE resumes (
 *   id VARCHAR(50) PRIMARY KEY,
 *   user_id INT NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   template VARCHAR(100) NOT NULL,
 *   status ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
 *   views INT DEFAULT 0,
 *   downloads INT DEFAULT 0,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
 * );
 */
