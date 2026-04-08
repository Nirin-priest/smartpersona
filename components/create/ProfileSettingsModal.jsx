"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ProfileSettingsModal({ isOpen, onClose, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // General state
  const [profile, setProfile] = useState({ name: "", profile_pic: "" });
  const [previewPic, setPreviewPic] = useState("");
  const fileInputRef = useRef(null);

  // Email state
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  // Security state
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  const fetchProfileData = async () => {
    try {
      const res = await axios.get("/api/users/profile");
      setProfile({
        name: res.data.user.name || "",
        profile_pic: res.data.user.profile_pic || ""
      });
      setPreviewPic(res.data.user.profile_pic || "");
      setEmails(res.data.emails || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.patch("/api/users/profile", {
        name: profile.name,
        profile_pic: previewPic
      });
      parseMessage("บันทึกข้อมูลเรียบร้อยแล้ว", "success");
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      parseMessage("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setIsLoading(true);
    try {
      await axios.post("/api/users/emails", { email: newEmail });
      setNewEmail("");
      fetchProfileData();
      if (onProfileUpdate) onProfileUpdate();
      parseMessage("เพิ่มอีเมลเรียบร้อยแล้ว", "success");
    } catch (err) {
      parseMessage(err.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveEmail = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบอีเมลนี้?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/users/emails?id=${id}`);
      fetchProfileData();
      if (onProfileUpdate) onProfileUpdate();
      parseMessage("ลบอีเมลเรียบร้อยแล้ว", "success");
    } catch (err) {
      parseMessage(err.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      parseMessage("รหัสผ่านใหม่ไม่ตรงกัน", "error");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("/api/users/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      parseMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว", "success");
    } catch (err) {
      parseMessage(err.response?.data?.message || "เกิดข้อผิดพลาด", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row h-[600px] max-h-[90vh]">
        
        {/* Sidebar */}
        <div className="md:w-64 bg-gray-50 p-6 flex flex-col border-r border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 mb-6">การตั้งค่า</h2>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {[
              { id: "general", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", label: "ข้อมูลทั่วไป" },
              { id: "emails", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "จัดการอีเมล" },
              { id: "security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "ความปลอดภัย" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex-1 overflow-y-auto p-8 pt-12">
            
            {message.text && (
              <div className={`p-4 mb-6 rounded-lg text-sm border flex items-start gap-3 animate-in slide-in-from-top-2 ${
                message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {message.type === 'error' 
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  }
                </svg>
                <p>{message.text}</p>
              </div>
            )}

            {activeTab === "general" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">ข้อมูลบัญชีของคุณ</h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <div className="w-24 h-24 rounded-full flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 overflow-hidden group-hover:border-blue-500 transition-colors">
                        {previewPic ? (
                          <img src={previewPic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-semibold">เปลี่ยนรูป</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">รูปโปรไฟล์</p>
                      <p className="text-xs text-gray-500 mb-3">แนะนำขนาด 256x256 px ไฟล์ PNG, JPG</p>
                      <button type="button" onClick={() => fileInputRef.current.click()} className="text-sm text-blue-600 font-semibold hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-4 py-1.5 rounded-lg transition-colors">อัปโหลดรูป</button>
                      <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อผู้ใช้</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="ชื่อที่ต้องการให้แสดง"
                      />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm"
                    >
                      {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "emails" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-2">อีเมลของคุณ</h3>
                <p className="text-sm text-gray-500 mb-6">คุณสามารถเพิ่มอีเมลได้หลายรายการเพื่อใช้สำหรับการติดต่อ</p>
                
                <div className="space-y-3 mb-8">
                  {emails.map((emailObj) => (
                    <div key={emailObj.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{emailObj.email}</p>
                          {emailObj.is_primary && (
                            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-green-100 text-green-700">หลัก</span>
                          )}
                        </div>
                      </div>
                      {!emailObj.is_primary && (
                        <button 
                          onClick={() => handleRemoveEmail(emailObj.id)}
                          disabled={isLoading}
                          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors focus:outline-none"
                          title="ลบอีเมล"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddEmail} className="bg-gray-50 border border-gray-100 p-5 rounded-xl">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">เพิ่มอีเมลใหม่</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="กรอกอีเมลของคุณ" 
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading || !newEmail}
                      className="bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                    >
                      บันทึกรายการ
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6">เปลี่ยนรหัสผ่าน</h3>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่านปัจจุบัน</label>
                    <input 
                      type="password" 
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="กรอกรหัสผ่านปัจจุบัน"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่านใหม่</label>
                    <input 
                      type="password" 
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
                    <input 
                      type="password" 
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-sm w-full"
                    >
                      {isLoading ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
