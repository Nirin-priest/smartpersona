"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((r) => r.json())
      .then((d) => setUserName(d.name || ""))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  const navItems = [
    { href: "/create/dashboarduser", label: "📋 Dashboard" },
    { href: "/create/templates",     label: "🎨 เทมเพลต" },
    { href: "/create/personalInfo",  label: "✏️ กรอกข้อมูล" },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-[#0066cc] to-[#0052a3] flex items-center justify-center text-white font-bold text-base shadow-[0_2px_8px_rgba(0,102,204,0.3)]">
            S
          </div>
          <span className="text-[#0066cc] font-bold text-lg tracking-wide">Smart Persona</span>
        </Link>

        {/* Right: User name + Logout */}
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">
              👋 สวัสดี, {userName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-linear-to-br from-[#0066cc] to-[#0052a3] text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-[0_2px_8px_rgba(0,102,204,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,102,204,0.4)] transition-all duration-200"
          >
            ออกจากระบบ
          </button>
        </div>

      </div>
    </nav>
  );
}
