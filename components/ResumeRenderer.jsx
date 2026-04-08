"use client";

import React from 'react';

export default function ResumeRenderer({ data }) {
  if (!data) return <div className="text-gray-400 p-8 italic">No data available</div>;
  
  const templateType = data.config?.template || "classic";

  /**
   * Safe data access helpers
   */
  const personal = data.personal || {};
  const education = data.education || {};
  const experience = data.experience || {};
  const summary = data.summary || {};
  const skills = data.skills || {};

  // ==========================================
  // ดีไซน์ที่ 1: Classic (เรียบหรู ขาวดำ ดูเป็นทางการ)
  // ==========================================
  if (templateType === "classic") {
    return (
      <div className="bg-white p-10 w-full min-h-[1056px] shadow-sm border border-gray-200 print:shadow-none print:border-none text-gray-800 font-serif">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          
          {personal.profilePic && (
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={personal.profilePic} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-sm" 
              />
            </div>
          )}

          <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
            {personal.firstName || "ชื่อ"} {personal.lastName || "นามสกุล"}
          </h1>
          <p className="text-sm text-gray-600">
            {personal.email || "อีเมล"} | {personal.phone || "เบอร์โทรศัพท์"}
          </p>
          <p className="text-sm text-gray-600 mt-1">{personal.address}</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 uppercase">ข้อมูลส่วนตัว / Summary</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary.details || "อธิบายเกี่ยวกับตัวคุณสั้นๆ..."}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 uppercase">การศึกษา / Education</h2>
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-base">{education.institution || "ชื่อสถานศึกษา"}</p>
                <p className="text-sm italic">{education.degree || "วุฒิการศึกษา"}</p>
              </div>
              <div className="text-right text-sm">
                <p>ปีที่จบ: {education.gradYear}</p>
                <p>GPA: {education.gpa}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 uppercase">ประสบการณ์ทำงาน / Experience</h2>
            <div className="mb-2">
              <p className="font-bold text-base">{experience.position || "ตำแหน่งงาน"}</p>
              <p className="text-sm text-gray-600">{experience.company || "ชื่อบริษัท"}</p>
              <p className="text-sm mt-2 whitespace-pre-wrap">{experience.details || "รายละเอียดงานที่ทำ..."}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold border-b border-gray-300 mb-3 uppercase">ทักษะความสามารถ / Skills</h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{skills.list || "ทักษะของคุณ (เช่น React, Node.js, English)..."}</p>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ดีไซน์ที่ 2: Modern (แบ่ง 2 ฝั่ง มีแถบสีด้านซ้าย)
  // ==========================================
  return (
    <div className="bg-white w-full min-h-[1056px] shadow-sm border border-gray-200 print:shadow-none print:border-none text-gray-800 font-sans flex flex-row">
      
      {/* แถบด้านซ้าย (สีน้ำเงินเข้ม) */}
      <div className="w-1/3 bg-blue-900 text-white p-8">
        <div className="flex flex-col items-center mb-8">
          {personal.profilePic ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={personal.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white mb-4 shadow-lg" />
          ) : (
             <div className="w-32 h-32 rounded-full bg-blue-800 border-4 border-white mb-4 flex items-center justify-center text-sm">รูปโปรไฟล์</div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-3 tracking-wide">CONTACT</h2>
            <ul className="text-sm space-y-3 text-blue-100">
              <li className="wrap-break-word">📧 {personal.email || "อีเมล"}</li>
              <li>📞 {personal.phone || "เบอร์โทร"}</li>
              <li>🏠 {personal.address || "ที่อยู่"}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-3 tracking-wide">SKILLS</h2>
            <p className="text-sm text-blue-100 whitespace-pre-wrap">{skills.list || "ทักษะของคุณ..."}</p>
          </div>
        </div>
      </div>

      {/* แถบด้านขวา (สีขาว) */}
      <div className="w-2/3 p-10 bg-gray-50">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase text-wrap wrap-break-word">
            {personal.firstName || "ชื่อ"} <span className="text-blue-600">{personal.lastName || "นามสกุล"}</span>
          </h1>
          <p className="text-gray-500 font-medium whitespace-pre-wrap mt-4">{summary.details || "แนะนำตัวสั้นๆ..."}</p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">🎓</span> 
              EDUCATION
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="font-bold text-lg text-gray-900">{education.degree || "วุฒิการศึกษา"}</p>
              <p className="text-blue-600 font-medium">{education.institution || "ชื่อสถานศึกษา"}</p>
              <p className="text-sm text-gray-500 mt-1">จบปี: {education.gradYear} | GPA: {education.gpa}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">💼</span> 
              EXPERIENCE
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="font-bold text-lg text-gray-900">{experience.position || "ตำแหน่ง"}</p>
              <p className="text-blue-600 font-medium">{experience.company || "ชื่อบริษัท"}</p>
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{experience.details || "รายละเอียดงานที่ทำ..."}</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
