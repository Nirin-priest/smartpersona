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
        "SELECT id, title, template, created_at FROM resumes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
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
        
        {/* Welcome Hero Banner */}
        <div className="bg-linear-to-r from-[#0066cc] to-[#0052a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_10px_30px_rgba(0,102,204,0.3)] mb-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 right-32 -mb-20 w-48 h-48 rounded-full bg-white opacity-5"></div>
          
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              สวัสดี, {user?.name || "ผู้ใช้คนเก่ง"} 👋
            </h1>
            <p className="text-blue-100 text-lg md:text-xl max-w-xl">
              ถึงเวลาสร้างและอัปเดตเรซูเม่ของคุณให้โดดเด่น เพื่อให้คุณพร้อมคว้าทุกโอกาสที่เข้ามาแล้ว!
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            {resumes.length > 0 ? (
              <Link href={`/create/personalInfo?resumeId=${resumes[0].id}`} className="bg-white text-[#0066cc] hover:bg-blue-50 font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                แก้ไขเรซูเม่ของคุณ
              </Link>
            ) : (
              <Link href="/create/templates" className="bg-white text-[#0066cc] hover:bg-blue-50 font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center gap-2">
                <Plus size={20} />
                สร้างเรซูเม่ใหม่
              </Link>
            )}
          </div>
        </div>

        {/* Recent Designs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock size={24} className="text-blue-500" />
            ดีไซน์ล่าสุดของคุณ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {resumes.length === 0 ? (
              <div className="col-span-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl h-48 flex flex-col items-center justify-center text-center p-6">
                <FileText size={32} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">ยังไม่มีเรซูเม่ของคุณ</p>
                <p className="text-sm text-gray-400 mt-1">กดปุ่มด้านบนเพื่อเริ่มสร้างเลย!</p>
              </div>
            ) : (
              resumes.map((resume) => (
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
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}