import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from "@/lib/db";

/**
 * ดึงข้อมูลผู้ใช้งาน (User Profile) จาก JWT Token และดึงชื่อ/สถานะล่าสุดจากฐานข้อมูล
 * นำไปใช้ใน Server Components และ Server Actions เพื่อประเมินสิทธิ์ (Auth check)
 * @returns {Promise<{id: string, name: string, role: string} | null>} คืนค่าข้อมูล User หรือ null ถ้าไม่มี/Token หมดอายุ
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Querying fresh data from the database ensures consistency across SSR pages
    const users = await query("SELECT id, name, role FROM users WHERE id = ?", [payload.id]);
    
    if (users.length === 0) return null;

    return {
      id: users[0].id,
      name: users[0].name,
      role: users[0].role
    };
  } catch (error) {
    return null;
  }
}
