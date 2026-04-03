import { ArrowLeft, FileText, User as UserIcon, Calendar, Activity, Download, Trash2, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';
import DeleteConfirmForm from '../../DeleteConfirmForm';
import { deleteResume } from '../../actions';
import ResumeDetailClient from './ResumeDetailClient';

import { Suspense } from 'react';

export default async function ViewResumePage({ params }) {
  const { id } = await params;
  let resume = null;
  let content = null;
  let errorMsg = null;

  try {
    // Fetch Resume Metadata + Author
    const [resumeRows] = await pool.query(
      `SELECT r.*, u.name as author_name, u.email as author_email 
       FROM resumes r 
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = ?`,
      [id]
    );

    if (resumeRows.length === 0) {
      errorMsg = 'Resume not found.';
    } else {
      resume = resumeRows[0];
      // Fetch Resume Content (Raw JSON Config)
      const [contentRows] = await pool.query('SELECT * FROM resume_content WHERE resume_id = ?', [id]);
      if (contentRows.length > 0) {
        content = contentRows[0];
      }
    }
  } catch (err) {
    errorMsg = 'Failed to load resume details: ' + err.message;
  }

  if (errorMsg && !resume) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
        <AlertCircle size={20} />
        {errorMsg}
        <Link href="/admin/resumes" className="ml-auto underline font-medium">Return to Resumes</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/resumes" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <FileText className="text-blue-500" /> 
              Resume: {resume.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">{resume.id}</span>
              <span>&bull;</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                resume.status === 'Published' ? 'bg-green-100 text-green-700' : 
                resume.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {resume.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Stats Toolbar */}
          <div className="flex bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden mr-2">
            <div className="px-4 py-2 border-r border-gray-200 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5"><Eye size={12} className="inline mr-1" />Views</span>
              <span className="text-lg font-bold text-gray-800">{resume.views}</span>
            </div>
            <div className="px-4 py-2 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5"><Download size={12} className="inline mr-1" />Downloads</span>
              <span className="text-lg font-bold text-gray-800">{resume.downloads}</span>
            </div>
          </div>

          <DeleteConfirmForm action={deleteResume.bind(null, resume.id)} itemName={`resume "${resume.title}"`}>
            <button type="submit" className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-medium shadow-sm transition-colors cursor-pointer flex items-center gap-2">
              <Trash2 size={16} />
              Delete Document
            </button>
          </DeleteConfirmForm>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Author Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <UserIcon size={16} className="text-gray-400" /> Author Details
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-100 to-blue-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {(resume.author_name || '?').charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 truncate" title={resume.author_name}>{resume.author_name || 'Unknown User'}</p>
                <p className="text-sm text-gray-500 truncate" title={resume.author_email}>{resume.author_email || 'No email provided'}</p>
                <Link href={`/admin/users/${resume.user_id}`} className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block">
                  View Author Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Meta Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <Activity size={16} className="text-gray-400" /> Document Info
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><FileText size={14} /> Template</span>
                <span className="font-medium text-gray-800 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{resume.template}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Created</span>
                <span className="font-medium text-gray-800">{new Date(resume.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="lg:col-span-2 bg-gray-50 flex items-center justify-center min-h-[400px] border border-gray-100 rounded-xl animate-pulse text-gray-400">Loading Preview...</div>}>
          <ResumeDetailClient 
              resumeData={(() => {
                const safeParse = (val) => {
                  if (!val) return {};
                  if (typeof val === 'object') return val;
                  try { return JSON.parse(val); } catch { return {}; }
                };
                return {
                  config: safeParse(content?.config),
                  personal: safeParse(content?.personal),
                  education: safeParse(content?.education),
                  experience: safeParse(content?.experience),
                  summary: safeParse(content?.summary),
                  skills: safeParse(content?.skills),
                };
              })()} 
          />
        </Suspense>
      </div>
    </div>
  );
}
