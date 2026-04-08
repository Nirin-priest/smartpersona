import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

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
    // รัน queries พร้อมกันด้วย Promise.all
    const [
      [userRows],
      [resumeRows],
      [usersWithResumesRows],
      [recentRows],
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM resumes'),
      pool.query('SELECT COUNT(DISTINCT user_id) as count FROM resumes'),
      pool.query('SELECT id, name, email, status, created_at FROM users ORDER BY created_at DESC LIMIT 4'),
    ]);

    return NextResponse.json({
      totalUsers: userRows[0].count,
      totalResumes: resumeRows[0].count,
      totalUsersWithResumes: usersWithResumesRows[0].count,
      recentUsers: recentRows,
    }, {
      headers: {
        // cache 30 วินนาที (ตรงกันกับ polling interval)
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=10',
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
