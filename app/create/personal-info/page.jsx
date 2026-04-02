"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PersonalInfoPage() {
  const [form, setForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    province: "",
    lineId: "",
    dob: "",
  });

  const router = useRouter();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    router.push("/create/work-experience");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          STEP 1
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">
          1. ข้อมูลส่วนตัว
        </h1>
        <p className="mt-2 text-slate-600">
          กรอกข้อมูลส่วนตัวเพื่อสร้าง Resume
        </p>

        <form onSubmit={handleNext} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              คำนำหน้า
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="เช่น นาย"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              ชื่อ (อังกฤษ)
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.firstName}
              onChange={handleChange("firstName")}
              placeholder="First name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              นามสกุล (อังกฤษ)
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.lastName}
              onChange={handleChange("lastName")}
              placeholder="Last name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              เบอร์โทร
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="082-345-6789"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              ประเทศ
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.country}
              onChange={handleChange("country")}
              placeholder="ประเทศไทย"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              จังหวัด
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.province}
              onChange={handleChange("province")}
              placeholder="กรุงเทพมหานคร"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Line ID
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={form.lineId}
              onChange={handleChange("lineId")}
              placeholder="Line ID"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              วันเกิด
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="date"
              value={form.dob}
              onChange={handleChange("dob")}
            />
          </div>

          <div className="md:col-span-2 mt-3 flex w-full justify-between gap-2">
            <Link href="/" className="w-full md:w-auto">
              <button
                type="button"
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                ย้อนกลับ
              </button>
            </Link>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 md:w-auto"
            >
              ถัดไป
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
