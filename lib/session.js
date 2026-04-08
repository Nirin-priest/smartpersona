import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

/**
 * ดึงข้อมูลผู้ใช้งาน (User Profile) จาก JWT Token ที่เก็บในคุกกี้ปัจจุบัน
 * นำไปใช้ใน Server Components และ Server Actions เพื่อประเมินสิทธิ์ (Auth check)
 * @returns {Promise<{id: string, name: string, role: string} | null>} คืนค่าข้อมูล User หรือ null ถ้าไม่มี/Token หมดอายุ
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: payload.id,
      name: payload.name,
      role: payload.role || 'user' // Default to user if role not explicitly in payload
    };
  } catch (error) {
    return null;
  }
}
