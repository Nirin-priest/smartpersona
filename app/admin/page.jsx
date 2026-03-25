import { Users, FileText, Activity, TrendingUp, Settings, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import pool from './lib/db';
import DownloadButton from './DownloadButton';

export default async function AdminDashboard() {
  let dbConnected = false;
  let totalUsers = 0;
  let totalResumes = 0;
  let recentUsers = [];
  let dbError = null;

  try {
    // Attempt to connect and fetch from MySQL
    const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    totalUsers = userRows[0].count;

    const [resumeRows] = await pool.query('SELECT COUNT(*) as count FROM resumes');
    totalResumes = resumeRows[0].count;

    const [recent] = await pool.query('SELECT id, name, email, status, created_at as date FROM users ORDER BY created_at DESC LIMIT 4');
    recentUsers = recent.map(user => ({
      ...user,
      date: new Date(user.date).toLocaleDateString()
    }));

    dbConnected = true;
  } catch (err) {
    dbError = err.message;
    // Fallback to mock data if no database is connected yet
    totalUsers = 1248;
    totalResumes = 3842;
    recentUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', date: 'Just now', status: 'Active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', date: 'Today', status: 'Active' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', date: 'Yesterday', status: 'Inactive' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', date: '2 days ago', status: 'Active' },
    ];
  }

  const stats = [
    { name: 'Total Users', value: totalUsers.toLocaleString(), icon: Users, change: '+12%', changeType: 'positive' },
    { name: 'Total Resumes', value: totalResumes.toLocaleString(), icon: FileText, change: '+24%', changeType: 'positive' },
    { name: 'Active Users (24h)', value: '184', icon: Activity, change: '+5%', changeType: 'positive' },
    { name: 'Conversion Rate', value: '12.4%', icon: TrendingUp, change: '-1%', changeType: 'negative' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
          {!dbConnected && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
              <AlertCircle size={16} />
              <span>Running with mock data: Cannot connect to MySQL ({dbError})</span>
            </div>
          )}
        </div>
        <a href="/api/admin/export-users" download className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors inline-block text-center">
          Download Report
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between group hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Recent Activity Table */}
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.date}</td>
                    <td className="py-4 px-6 text-right">
                        <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                          View Profile
                        </Link>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Welcome to your startup!</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              This dashboard provides a high-level overview of your resume building application. 
              The statistics on the left show key performance indicators.
            </p>
            
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">Database Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <p className="font-medium text-sm text-white">
                    {dbConnected ? 'MySQL Connected' : 'MySQL Disconnected'}
                  </p>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                <p className="text-xs text-blue-100 uppercase tracking-wider mb-1">System Health</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <p className="font-medium text-sm text-white">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link href="/admin/settings" className="mt-6 w-full py-2.5 bg-white text-blue-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer block">
            View Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
