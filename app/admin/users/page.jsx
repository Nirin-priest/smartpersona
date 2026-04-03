import { Search, Plus, Edit2, Trash2, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';
import { deleteUser } from '../actions';
import DeleteConfirmForm from '../DeleteConfirmForm';

export default async function UsersManagementPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const role = params?.role || '';
  const status = params?.status || '';
  const successMsg = params?.success || '';

  const page = parseInt(params?.page || '1', 10) || 1;
  const ITEMS_PER_PAGE = 10;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let users = [];
  let dbError = null;
  let totalItems = 0;
  let totalPages = 1;

  try {
    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (role && role !== 'All Roles') {
      whereClause += ' AND u.role = ?';
      queryParams.push(role);
    }
    if (status && status !== 'All Status') {
      whereClause += ' AND u.status = ?';
      queryParams.push(status);
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      queryParams
    );
    totalItems = countRows[0].count;
    totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
        (SELECT COUNT(*) FROM resumes r WHERE r.user_id = u.id) as resumes
       FROM users u ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, ITEMS_PER_PAGE, offset]
    );

    users = rows.map((user) => ({
      ...user,
      joined: new Date(user.created_at).toLocaleDateString('th-TH'),
    }));
  } catch (error) {
    dbError = error.message;
  }

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{successMsg}</span>
          </div>
          <Link href="/admin/users" className="text-green-500 hover:text-green-700 p-1 rounded-md hover:bg-green-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        </div>
      )}

      {dbError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          <AlertCircle size={16} />
          <span>Database error: {dbError}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Users Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            {totalItems} user{totalItems !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus size={18} />
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Bar */}
        <form method="GET" className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/50">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              name="role"
              defaultValue={role || 'All Roles'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              name="status"
              defaultValue={status || 'All Status'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
            >
              Filter
            </button>
            {(search || role || status) && (
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name/Email</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resumes</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status?.toLowerCase() === 'active'
                          ? 'bg-green-100 text-green-700'
                          : user.status?.toLowerCase() === 'suspended'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status?.toLowerCase() === 'active'
                            ? 'bg-green-500'
                            : user.status?.toLowerCase() === 'suspended'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{user.resumes}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.joined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <DeleteConfirmForm action={deleteUser.bind(null, user.id)} itemName={`user "${user.name}"`}>
                        <button
                          type="submit"
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </DeleteConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !dbError && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-400">
                    <Users className="mx-auto mb-3 opacity-30" size={36} />
                    <p className="text-sm font-medium">No users found</p>
                    <p className="text-xs mt-1 text-gray-400">
                      {search || role || status ? 'Try adjusting your filters' : 'Add your first user to get started'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 bg-white gap-4">
          <span>
            Showing {users.length > 0 ? offset + 1 : 0}–{Math.min(offset + ITEMS_PER_PAGE, totalItems)} of {totalItems} users
          </span>
          <div className="flex gap-1">
            {page > 1 ? (
              <Link
                href={`/admin/users?page=${page - 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed" disabled>
                Previous
              </button>
            )}
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded border border-blue-100">
              {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={`/admin/users?page=${page + 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Next
              </Link>
            ) : (
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed" disabled>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
