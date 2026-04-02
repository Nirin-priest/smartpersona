"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import { useResume } from "../ResumeContext"; 
import ResumePreview from "../ResumePreview";

export default function ResumeBuilder() {
  const { data, updateData, resumeId, setResumeId } = useResume(); 
  const resumeRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  const handlePrint = useReactToPrint({
    contentRef: resumeRef, 
    documentTitle: data.personal?.firstName ? `${data.personal.firstName}_Resume` : "My_Resume",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData("personal", "profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ===== ฟังก์ชัน Save Resume =====
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, data }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Save error:", err);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
        return;
      }

      const result = await res.json();
      if (!resumeId) {
        setResumeId(result.resumeId); // เก็บ id ไว้สำหรับ update ครั้งต่อไป
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // สีปุ่มตาม saveStatus
  const saveButtonStyle = {
    idle: "bg-green-600 hover:bg-green-700 text-white",
    saving: "bg-gray-400 cursor-not-allowed text-white",
    saved: "bg-green-500 text-white",
    error: "bg-red-500 hover:bg-red-600 text-white",
  }[saveStatus];

  const saveButtonLabel = {
    idle: "💾 บันทึก Resume",
    saving: "กำลังบันทึก...",
    saved: "✅ บันทึกแล้ว!",
    error: "❌ บันทึกไม่สำเร็จ",
  }[saveStatus];

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ปุ่มย้อนกลับ */}
        <Link href="/create/templates" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          ย้อนกลับไปเลือกเทมเพลต
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= ฝั่งซ้าย: ฟอร์มกรอกข้อมูล ================= */}
        <div className="space-y-6 h-[90vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* 1. ข้อมูลส่วนตัว */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">1. ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ (อังกฤษ)</label>
                <input type="text" placeholder="First name" value={data.personal?.firstName || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("personal", "firstName", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล (อังกฤษ)</label>
                <input type="text" placeholder="Last name" value={data.personal?.lastName || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("personal", "lastName", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">รูปโปรไฟล์</label>
                <input type="file" accept="image/*" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleImageUpload} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input type="text" placeholder="email@example.com" value={data.personal?.email || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("personal", "email", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
                <input type="text" placeholder="08x-xxx-xxxx" value={data.personal?.phone || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("personal", "phone", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                <textarea rows="2" placeholder="ที่อยู่ปัจจุบันของคุณ" value={data.personal?.address || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("personal", "address", e.target.value)}></textarea>
              </div>
            </div>
          </div>

          {/* 2. การศึกษา */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">2. การศึกษา</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">วุฒิการศึกษา</label>
                <input type="text" placeholder="เช่น ปริญญาตรี" value={data.education?.degree || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("education", "degree", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสถาบัน</label>
                <input type="text" placeholder="เช่น มหาวิทยาลัย..." value={data.education?.institution || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("education", "institution", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ปีที่จบ</label>
                <input type="text" placeholder="2024" value={data.education?.gradYear || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("education", "gradYear", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เกรดเฉลี่ย</label>
                <input type="text" placeholder="3.50" value={data.education?.gpa || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("education", "gpa", e.target.value)} />
              </div>
            </div>
          </div>

          {/* 3. ประสบการณ์ทำงาน */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">3. ประสบการณ์ทำงาน</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                <input type="text" placeholder="เช่น Frontend Developer" value={data.experience?.position || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("experience", "position", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท</label>
                <input type="text" placeholder="เช่น บริษัท เอบีซี จำกัด" value={data.experience?.company || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("experience", "company", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดงาน</label>
                <textarea rows="3" placeholder="อธิบายหน้าที่ความรับผิดชอบ..." value={data.experience?.details || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("experience", "details", e.target.value)}></textarea>
              </div>
            </div>
          </div>

          {/* 4. Summary & Skills */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">4. บทสรุปและทักษะ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บทสรุปตัวตน (Professional Summary)</label>
                <textarea rows="3" placeholder="เขียนสรุปเป้าหมายหรือความโดดเด่นของคุณ..." value={data.summary?.details || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("summary", "details", e.target.value)}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ทักษะความสามารถ (Skills)</label>
                <textarea rows="3" placeholder="เช่น React, Tailwind CSS, English Communication..." value={data.skills?.list || ""} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onChange={(e) => updateData("skills", "list", e.target.value)}></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ฝั่งขวา: Resume Template Preview ================= */}
        <div className="sticky top-8 h-[90vh] flex flex-col">
          
          {/* ปุ่ม Save + Download PDF */}
          <div className="flex justify-end gap-3 mb-4">
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className={`font-semibold py-2 px-5 rounded-lg shadow-md transition-all flex items-center gap-2 ${saveButtonStyle}`}
            >
              {saveButtonLabel}
            </button>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              ดาวน์โหลด PDF
            </button>
          </div>

          {/* ครอบ Ref ไว้และเรียกใช้ Component ResumePreview */}
          <div className="w-full h-full overflow-y-auto custom-scrollbar shadow-xl border-t border-gray-200">
             <div ref={resumeRef} className="bg-white">
                <ResumePreview />
             </div>
          </div>

        </div>

        </div>
      </div>
    </div>
  );
}