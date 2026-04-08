import { Users, FileText, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';
import LiveStats from '@/components/admin/LiveStats';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let dbConnected = false;
  let totalUsers = 0;
  let totalResumes = 0;
  let activeUsers24h = 0;
  let conversionRate = '0.0%';
  let recentUsers = [];
  let dbError = null;

  try {
    // รัน queries พร้อมกันด้วย Promise.all แทนที่จะรอทีละ query
    const [
      [userRows],
      [resumeRows],
      [activeRows],
      [usersWithResumesRows],
      [recent],
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM resumes'),
      pool.query('SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL 1 DAY'),
      pool.query('SELECT COUNT(DISTINCT user_id) as count FROM resumes'),
      pool.query('SELECT id, name, email, status, created_at as date FROM users ORDER BY created_at DESC LIMIT 5'),
    ]);

    totalUsers = userRows[0].count;
    totalResumes = resumeRows[0].count;
    activeUsers24h = activeRows[0].count;
    const usersWithResumes = usersWithResumesRows[0].count;
    conversionRate =
      totalUsers > 0
        ? ((usersWithResumes / totalUsers) * 100).toFixed(1) + '%'
        : '0.0%';
    recentUsers = recent.map((user) => ({
      ...user,
      date: new Date(user.date).toLocaleDateString('th-TH'),
    }));
    dbConnected = true;
  } catch (err) {
    dbError = err.message;
  }

  const initialStats = {
    totalUsers,
    totalResumes,
    activeUsers24h,
    conversionRate
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
          {!dbConnected && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
              <AlertCircle size={16} />
              <span>Database connection failed: {dbError}</span>
            </div>
          )}
          {dbConnected && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
              Live data from MySQL
            </p>
          )}
        </div>
        <a
          href="/api/admin/export-users"
          download
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors inline-block text-center"
        >
          Download Report
        </a>
      </div>

      {/* Stats Grid - Now Live! */}
      <LiveStats initialStats={initialStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Recent Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Recent User Registrations</h3>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.status?.toLowerCase() === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.date}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400">
                      <Users className="mx-auto mb-2 opacity-30" size={32} />
                      <p className="text-sm">No users registered yet</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">SmartPersona Admin</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              ภาพรวมของแพลตฟอร์มสร้าง Resume ทั้งหมดจากข้อมูลจริงในฐานข้อมูล
            </p>

            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Database Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dbConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    }`}
                  ></div>
                  <p className="font-medium text-sm text-white">
                    {dbConnected ? 'MySQL Connected' : 'MySQL Disconnected'}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Quick Links</p>
                <div className="flex flex-col gap-1 text-sm">
                  <Link href="/admin/users/new" className="text-white/80 hover:text-white transition-colors">
                    + Add New User
                  </Link>
                  <Link href="/admin/resumes" className="text-white/80 hover:text-white transition-colors">
                    → View All Resumes
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="mt-6 w-full py-2.5 bg-white text-blue-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer block"
          >
            View Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
