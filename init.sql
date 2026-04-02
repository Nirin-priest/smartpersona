-- =============================================
-- SmartPersona Database Init Script
-- Run: docker exec -i mysql mysql -uroot -proot < init.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS smartpersona_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartpersona_db;

-- =============================================
-- Table: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NULL UNIQUE,
  password    VARCHAR(255) NULL,
  role        ENUM('User', 'Admin') DEFAULT 'User',
  status      ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: resumes
-- id ใช้ UUID (varchar 50) เพื่อความปลอดภัย
-- =============================================
CREATE TABLE IF NOT EXISTS resumes (
  id          VARCHAR(50) PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  template    VARCHAR(100) NOT NULL DEFAULT 'classic',
  status      ENUM('Draft', 'Published', 'Archived') DEFAULT 'Draft',
  views       INT DEFAULT 0,
  downloads   INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- Table: resume_content
-- เก็บข้อมูล Resume แยกออกมา (JSON format)
-- =============================================
CREATE TABLE IF NOT EXISTS resume_content (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  resume_id   VARCHAR(50) NOT NULL UNIQUE,
  config      JSON,
  personal    JSON,
  education   JSON,
  experience  JSON,
  summary     JSON,
  skills      JSON,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
);

-- =============================================
-- Seed: Admin user (password: admin1234)
-- bcrypt hash ของ "admin1234"
-- =============================================
INSERT IGNORE INTO users (name, email, password, role, status) VALUES
(
  'Admin',
  'admin@smartpersona.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'Admin',
  'Active'
);
