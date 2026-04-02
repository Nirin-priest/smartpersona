"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PreferredJobPage() {
  const [job, setJob] = useState({
    field: "",
    subField: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryType: "monthly",
  });

  const router = useRouter();

  const onChange = (field) => (e) => {
    setJob((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("บันทึกข้อมูลสำเร็จ! (ตัวอย่าง)");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          STEP 4
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">
          4. ตำแหน่งงานที่สนใจ
        </h1>
        <p className="mt-2 text-slate-600">ตั้งค่าเป้าหมายงานที่คุณต้องการ</p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              สายงาน
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={job.field}
              onChange={onChange("field")}
              placeholder="เช่น งานการเงิน"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              สายย่อย
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={job.subField}
              onChange={onChange("subField")}
              placeholder="เช่น งานการเงินและสินเชื่อ"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              สถานที่ทำงาน
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="text"
              value={job.location}
              onChange={onChange("location")}
              placeholder="เช่น กรุงเทพ"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              เงินเดือนที่ต้องการ (ขั้นต่ำ)
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={job.salaryMin}
              onChange={onChange("salaryMin")}
              placeholder="25000"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              เงินเดือนที่ต้องการ (สูงสุด)
            </label>
            <input
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="number"
              value={job.salaryMax}
              onChange={onChange("salaryMax")}
              placeholder="50000"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              ประเภทเงินเดือน
            </label>
            <select
              className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={job.salaryType}
              onChange={onChange("salaryType")}
            >
              <option value="monthly">ต่อเดือน</option>
              <option value="annual">ต่อปี</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-4 flex flex-col gap-2 md:flex-row md:justify-between">
            <Link href="/create/education" className="md:w-auto">
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
              ส่งข้อมูล
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
