import { Search, FileText, Download, Eye, Trash2, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import pool from '../lib/db';
import { deleteResume } from '../actions';
import DownloadButton from '../DownloadButton';
import DeleteConfirmForm from '../DeleteConfirmForm';

export default async function ResumesManagementPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const template = params?.template || '';
  const successMsg = params?.success || '';

  const pageParams = params?.page || '1';
  const page = parseInt(pageParams, 10) || 1;
  const ITEMS_PER_PAGE = 5;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let resumes = [];
  let dbError = null;
  let totalItems = 0;
  let totalPages = 1;

  try {
    let whereClause = `WHERE 1=1`;
    let queryParams = [];

    if (search) {
      whereClause += ` AND (r.title LIKE ? OR u.name LIKE ? OR r.id LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (template && template !== 'All Templates') {
      whereClause += ` AND r.template = ?`;
      queryParams.push(template);
    }
    
    // Get Total Count
    const countQuery = `SELECT COUNT(*) as count FROM resumes r LEFT JOIN users u ON r.user_id = u.id ${whereClause}`;
    const [countRows] = await pool.query(countQuery, queryParams);
    totalItems = countRows[0].count;
    totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Get Paginated Data
    let query = `
      SELECT r.id, r.title, r.template, r.status, r.views, r.downloads, r.created_at, u.name as user 
      FROM resumes r 
      LEFT JOIN users u ON r.user_id = u.id 
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(ITEMS_PER_PAGE, offset);

    const [rows] = await pool.query(query, queryParams);
    
    resumes = rows.map(resume => ({
      ...resume,
      date: new Date(resume.created_at).toLocaleDateString()
    }));

  } catch (error) {
    dbError = error.message;
    // Fallback Mock Data
    resumes = [
      { id: 'RES-001', user: 'John Doe', title: 'Software Engineer Resume', template: 'Modern UX', status: 'Published', date: '2023-12-05', views: 42, downloads: 12 },
      { id: 'RES-002', user: 'Jane Smith', title: 'Marketing Director CV', template: 'Professional', status: 'Draft', date: '2023-12-08', views: 0, downloads: 0 },
      { id: 'RES-003', user: 'Robert Johnson', title: 'Data Scientist Profile', template: 'Minimalist', status: 'Published', date: '2023-11-20', views: 156, downloads: 45 },
      { id: 'RES-004', user: 'Emily Davis', title: 'Product Manager Resume', template: 'Creative', status: 'Published', date: '2023-12-01', views: 89, downloads: 22 },
      { id: 'RES-005', user: 'Michael Wilson', title: 'UX Designer Portfolio', template: 'Modern UX', status: 'Archived', date: '2023-10-15', views: 320, downloads: 110 },
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
          <Link href="/admin/resumes" className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-md hover:bg-green-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Resumes Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage user-created resumes across the platform.</p>
          {dbError && (
             <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 inline-flex">
               <AlertCircle size={16} />
               <span>Using mock data ({dbError})</span>
             </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <a href="/api/admin/export-resumes" download className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <Download size={18} />
            Export Data
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <form method="GET" className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              name="search"
              defaultValue={search}
              placeholder="Search resumes by title, user, or ID..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
              name="template" 
              defaultValue={template || 'All Templates'}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-auto cursor-pointer"
            >
              <option value="All Templates">All Templates</option>
              <option value="Modern UX">Modern UX</option>
              <option value="Professional">Professional</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Creative">Creative</option>
            </select>
            <button type="submit" className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg text-sm transition-colors cursor-pointer">Apply</button>
          </div>
        </form>

        {/* Resumes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Details</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-blue-500 bg-blue-50 p-2 rounded">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{resume.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{resume.id}</span>
                          <span>&bull;</span>
                          <span>{resume.template} Template</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-medium text-gray-800">{resume.user || 'Unknown User'}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      resume.status.toLowerCase() === 'published' ? 'bg-green-100 text-green-700' : 
                      resume.status.toLowerCase() === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {resume.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1" title="Views">
                        <Eye size={14} className="text-gray-400" />
                        <span>{resume.views}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Downloads">
                        <Download size={14} className="text-gray-400" />
                        <span>{resume.downloads}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{resume.date}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/resumes/${resume.id}`} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors cursor-pointer" title="View Resume">
                        <Eye size={16} />
                      </Link>
                      <DownloadButton className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center justify-center cursor-pointer" title="Download PDF" message={"Generating and downloading PDF...\n\n(Mock feature)"}>
                        <Download size={16} />
                      </DownloadButton>
                      
                      {/* Interactive Delete with Server Action Form */}
                      <DeleteConfirmForm action={deleteResume.bind(null, resume.id)} itemName={`resume "${resume.title}"`}>
                        <button type="submit" className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors cursor-pointer" title="Delete Resume" disabled={!!dbError}>
                          <Trash2 size={16} className={dbError ? 'opacity-50' : ''} />
                        </button>
                      </DeleteConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
              {resumes.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No resumes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 bg-white gap-4">
          <span>
            Showing {resumes.length > 0 ? offset + 1 : 0} to {Math.min(offset + ITEMS_PER_PAGE, totalItems)} of {totalItems} entries
          </span>
          
          <div className="flex gap-1">
            {page > 1 ? (
              <Link href={`/admin/resumes?page=${page - 1}&search=${encodeURIComponent(search)}&template=${encodeURIComponent(template)}`} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                Previous
              </Link>
            ) : (
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed" disabled>Previous</button>
            )}
            
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium rounded border border-blue-100">
              Page {page} of {totalPages || 1}
            </span>
            
            {page < totalPages ? (
              <Link href={`/admin/resumes?page=${page + 1}&search=${encodeURIComponent(search)}&template=${encodeURIComponent(template)}`} className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
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
