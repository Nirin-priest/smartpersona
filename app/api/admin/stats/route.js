import pool from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics
 *     description: Returns total user count, total resume count, and recent user registrations.
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 1248
 *                 totalResumes:
 *                   type: integer
 *                   example: 3842
 *                 recentUsers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = userRows[0].count;

    const [resumeRows] = await pool.query('SELECT COUNT(*) as count FROM resumes');
    const totalResumes = resumeRows[0].count;

    const [recentRows] = await pool.query(
      'SELECT id, name, email, status, created_at FROM users ORDER BY created_at DESC LIMIT 4'
    );

    return NextResponse.json({ totalUsers, totalResumes, recentUsers: recentRows });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
