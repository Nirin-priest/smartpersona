import Link from 'next/link';
import { ArrowLeft, FileText, Download, User as UserIcon, Calendar, Eye, Activity } from 'lucide-react';
import pool from '../../lib/db';
import { notFound } from 'next/navigation';
import DownloadButton from '../../DownloadButton';

export default async function ViewResumePage({ params }) {
  const { id } = await params;
  
  let resume = null;
  
  try {
    const [rows] = await pool.query(`
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM resumes r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      notFound();
    }
    resume = rows[0];
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    resume = { 
      id, title: 'Demo Resume', template: 'Modern UX', status: 'Published', 
      views: 120, downloads: 45, created_at: new Date().toISOString(),
      user_name: 'Demo User', user_email: 'demo@example.com'
    };
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/resumes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Resume Details</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{resume.id}</span>
              <span>&bull;</span>
              <span>{resume.template} Template</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
           <DownloadButton className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors cursor-pointer flex items-center gap-2" message={"Generating and downloading PDF...\n\n(Mock feature)"}>
            <Download size={18} />
             Download PDF
           </DownloadButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{resume.title}</h3>
                <span className={`inline-flex items-center mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${
                  resume.status.toLowerCase() === 'published' ? 'bg-green-100 text-green-700' : 
                  resume.status.toLowerCase() === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {resume.status}
                </span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Content Preview</h4>
              <div className="aspect-[1/1.4] bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-x-0 inset-y-0 opacity-10 flex flex-col items-center justify-center p-8 text-center text-gray-600">
                   <FileText size={80} className="mb-4" />
                   <p className="text-lg">Web Editor Canvas Mockup</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Author Details</h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-50 text-gray-500 rounded-lg">
                <UserIcon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{resume.user_name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{resume.user_email || 'No email'}</p>
              </div>
            </div>
            <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View User Profile &rarr;</Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Performance Stats</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye size={16} />
                  <span className="text-sm">Total Views</span>
                </div>
                <span className="font-semibold text-gray-800">{resume.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Download size={16} />
                  <span className="text-sm">Total Downloads</span>
                </div>
                <span className="font-semibold text-gray-800">{resume.downloads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity size={16} />
                  <span className="text-sm">Conversion Rate</span>
                </div>
                <span className="font-semibold text-green-600">
                  {resume.views > 0 ? Math.round((resume.downloads / resume.views) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Metadata</h4>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span className="text-sm">Created: {new Date(resume.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
