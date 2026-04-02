"use client"; // เพิ่ม useClient เพราะต้องใช้ Context และ Router

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useResume } from "../ResumeContext";

export default function TemplatesPage() {
  const router = useRouter();
  const { updateData } = useResume(); // ดึง updateData มาใช้

  const templates = [
    { id: 'classic', name: 'Classic Professional', desc: 'เรียบหรู ดูเป็นทางการ เหมาะกับองค์กรใหญ่', color: 'bg-gray-800' },
    { id: 'modern', name: 'Modern Creative', desc: 'แบ่งสัดส่วนชัดเจน ทันสมัย เหมาะกับสายครีเอทีฟ', color: 'bg-blue-900' }
  ];

  // ฟังก์ชันตอนกดเลือกเทมเพลต
  const handleSelectTemplate = (templateId) => {
    updateData("config", "template", templateId); // 1. จำค่าเทมเพลตที่เลือก
    router.push("/create/personalInfo");          // 2. เด้งไปหน้ากรอกข้อมูล
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/create/dashboarduser" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          กลับหน้าหลัก
        </Link>

        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">เลือกเทมเพลตเรซูเม่</h2>
          <p className="text-gray-500 text-lg">เริ่มต้นสร้างความประทับใจแรกด้วยดีไซน์ที่ใช่สำหรับคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-200 overflow-hidden flex flex-col group">
              <div className="h-72 bg-gray-100 p-6 flex justify-center items-center relative overflow-hidden">
                <div className="w-[70%] h-[120%] bg-white shadow-md border border-gray-200 absolute top-6 flex flex-col transition-transform duration-500 group-hover:-translate-y-4">
                  <div className={`h-12 w-full ${tpl.color}`}></div>
                  <div className="p-3 space-y-3">
                    <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                    <div className="h-1.5 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{tpl.name}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1">{tpl.desc}</p>
                
                {/* เปลี่ยนจาก Link เป็น button */}
                <button 
                  onClick={() => handleSelectTemplate(tpl.id)} 
                  className="w-full text-center bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  ใช้เทมเพลตนี้
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}