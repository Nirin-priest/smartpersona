"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EducationPage() {
  const [edu, setEdu] = useState({
    degree: "",
    year: "",
    school: "",
    country: "",
    gpa: "",
  });

  const router = useRouter();

  const onChange = (field) => (e) => {
    setEdu((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    router.push("/create/preferred-job");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          STEP 3
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">
          3. การศึกษา
        </h1>
        <p className="mt-2 text-slate-600">เพิ่มข้อมูลการศึกษาของคุณให้ครบ</p>

        <form onSubmit={handleNext} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              วุฒิการศึกษา
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={edu.degree}
              onChange={onChange("degree")}
              placeholder="เช่น ปริญญาตรี"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              ปีสำเร็จการศึกษา
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={edu.year}
              onChange={onChange("year")}
              placeholder="2024"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              ชื่อสถาบัน
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={edu.school}
              onChange={onChange("school")}
              placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              ประเทศ
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={edu.country}
              onChange={onChange("country")}
              placeholder="เช่น ประเทศไทย"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              เกรดเฉลี่ย
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={edu.gpa}
              onChange={onChange("gpa")}
              placeholder="เช่น 3.57"
            />
          </div>

          <div className="md:col-span-2 mt-4 flex flex-col gap-2 md:flex-row md:justify-between">
            <Link href="/create/work-experience" className="md:w-auto">
              <button
                type="button"
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 md:w-auto"
              >
                ย้อนกลับ
              </button>
            </Link>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 md:w-auto"
            >
              ถัดไป
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
