import { Search, Plus, MoreVertical, Edit2, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import pool from '../lib/db';
import { deleteUser } from '../actions';
import DeleteConfirmForm from '../DeleteConfirmForm';

export default async function UsersManagementPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const role = params?.role || '';
  const status = params?.status || '';
  const successMsg = params?.success || '';
  
  const pageParams = params?.page || '1';
  const page = parseInt(pageParams, 10) || 1;
  const ITEMS_PER_PAGE = 5;
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  let users = [];
  let dbError = null;
  let totalItems = 0;
  let totalPages = 1;

  try {
    let whereClause = `WHERE 1=1`;
    let queryParams = [];

    if (search) {
      whereClause += ` AND (u.name LIKE ? OR u.email LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (role && role !== 'All Roles') {
      whereClause += ` AND u.role = ?`;
      queryParams.push(role);
    }

    if (status && status !== 'All Status') {
      whereClause += ` AND u.status = ?`;
      queryParams.push(status);
    }

    // Get Total Count for Pagination
    const countQuery = `SELECT COUNT(*) as count FROM users u ${whereClause}`;
    const [countRows] = await pool.query(countQuery, queryParams);
    totalItems = countRows[0].count;
    totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Get Paginated Data
    let query = `
      SELECT u.id, u.name, u.email, u.role, u.status, u.created_at, 
      (SELECT COUNT(*) FROM resumes r WHERE r.user_id = u.id) as resumes
      FROM users u
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Add pagination params
    queryParams.push(ITEMS_PER_PAGE, offset);

    const [rows] = await pool.query(query, queryParams);
    
    users = rows.map(user => ({
      ...user,
      joined: new Date(user.created_at).toLocaleDateString()
    }));

  } catch (error) {
    dbError = error.message;
    // 2. Fallback to Mock Data if DB fails (e.g. table not created)
    users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', resumes: 3, joined: '2023-10-12' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', resumes: 1, joined: '2023-11-05' },
      { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Admin', status: 'Active', resumes: 5, joined: '2023-08-22' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'Inactive', resumes: 0, joined: '2023-11-20' },
      { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'User', status: 'Active', resumes: 2, joined: '2023-12-01' },
      { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', role: 'User', status: 'Suspended', resumes: 1, joined: '2023-09-15' },
    ];
  }

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="font-medium">{successMsg}</span>
          </div>
          <Link href="/admin/users" className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-md hover:bg-green-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Users Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage platform users and their permissions.</p>
          {dbError && (
             <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 inline-flex">
               <AlertCircle size={16} />
               <span>Using mock data ({dbError})</span>
             </div>
          )}
        </div>
        
        <Link href="/admin/users/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors cursor-pointer flex items-center gap-2">
          <Plus size={18} />
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        {/* Table Toolbar */}
        <form method="GET" className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
              name="role" 
              defaultValue={role || 'All Roles'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto cursor-pointer"
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select 
              name="status" 
              defaultValue={status || 'All Status'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
            <button type="submit" className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg text-sm transition-colors cursor-pointer">Apply</button>
          </div>
        </form>

        {/* Users Table */}
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 
                      user.status.toLowerCase() === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        user.status.toLowerCase() === 'active' ? 'bg-green-500' : 
                        user.status.toLowerCase() === 'suspended' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-medium">{user.resumes}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{user.joined}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/users/${user.id}`} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors cursor-pointer" title="Edit User">
                        <Edit2 size={16} />
                      </Link>
                      
                      {/* Interactive Delete with Server Action Form */}
                      <DeleteConfirmForm action={deleteUser.bind(null, user.id)} itemName={`user "${user.name}"`}>
                        <button type="submit" className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors cursor-pointer" title="Delete User" disabled={!!dbError}>
                          <Trash2 size={16} className={dbError ? 'opacity-50' : ''} />
                        </button>
                      </DeleteConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 bg-white gap-4">
          <span>
            Showing {users.length > 0 ? offset + 1 : 0} to {Math.min(offset + ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
          </span>
          
          <div className="flex gap-1">
            {page > 1 ? (
              <Link href={`/admin/users?page=${page - 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                Previous
              </Link>
            ) : (
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed" disabled>Previous</button>
            )}
            
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded border border-blue-100">
              Page {page} of {totalPages || 1}
            </span>
            
            {page < totalPages ? (
              <Link href={`/admin/users?page=${page + 1}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}&status=${encodeURIComponent(status)}`} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                Next
              </Link>
            ) : (
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed" disabled>Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
