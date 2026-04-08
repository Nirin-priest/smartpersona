import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import pool from "@/lib/db";
import { FileText, Clock, ChevronRight, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getCurrentUser();
  let resumes = [];

  if (user) {
    try {
      const [rows] = await pool.query(
        "SELECT id, title, template, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC",
        [user.id]
      );
      resumes = rows;
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    }
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50 font-sans p-6">
      <div className="max-w-6xl mx-auto pt-10">
        
        {/* Header & Search */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            วันนี้คุณจะสร้างอะไรดี?
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="ค้นหาเทมเพลตเรซูเม่, พอร์ตโฟลิโอ..." 
              className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-lg transition-all"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-8 mb-20 flex-wrap">
          {/* แก้จุดที่ 1 ตรงนี้ครับ */}
          <Link href="/create/templates" className="flex flex-col items-center group transition-transform hover:-translate-y-1">
            <div className="w-20 h-20 bg-linear-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white shadow-lg mb-3 group-hover:shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-gray-700">สร้างเรซูเม่</span>
          </Link>

          {/* ปุ่มหลอกอื่นๆ ให้ดูเป็น Dashboard */}
          {[
            { name: 'พอร์ตโฟลิโอ', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { name: 'จดหมายสมัครงาน', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center group opacity-60 cursor-not-allowed">
              <div className="w-20 h-20 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="text-base font-medium text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Recent Designs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={24} className="text-blue-500" />
            ดีไซน์ล่าสุดของคุณ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/create/templates" className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 group-hover:bg-blue-100 transition-colors">
                <Plus size={24} />
              </div>
              <span className="text-sm font-semibold text-gray-600">สร้างใหม่</span>
            </Link>

            {resumes.map((resume) => (
              <Link 
                key={resume.id} 
                href={`/create/personalInfo?resumeId=${resume.id}`}
                className="bg-white border border-gray-100 rounded-2xl h-64 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative border-b-4 border-b-blue-500"
              >
                <div className="flex-1 bg-gray-50 flex items-center justify-center p-6 relative">
                   <div className="w-24 h-32 bg-white shadow-md rounded border border-gray-100 flex flex-col p-2 gap-1 overflow-hidden group-hover:scale-105 transition-transform">
                      <div className="h-2 w-full bg-gray-100 rounded"></div>
                      <div className="h-1 w-2/3 bg-gray-50 rounded"></div>
                      <div className="h-1 w-full bg-gray-50 rounded mt-2"></div>
                      <div className="h-1 w-full bg-gray-50 rounded"></div>
                      <div className="h-1 w-full bg-gray-50 rounded"></div>
                   </div>
                   <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
                </div>
                <div className="p-4 bg-white border-t border-gray-50">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{resume.title || "Untitled Resume"}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{resume.template}</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}