// lib/db.js
import mysql from "mysql2/promise";

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'smartpersona_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} else {
  // ใน Development จะใช้ Global variable เพื่อกันการสร้าง Pool ซ้ำเมื่อไฟล์ถูกรีโหลดใหม่ (HMR)
  if (!globalThis.__dbPool) {
    globalThis.__dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'smartpersona_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  pool = globalThis.__dbPool;
}

export const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export default pool;
