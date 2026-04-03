import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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
