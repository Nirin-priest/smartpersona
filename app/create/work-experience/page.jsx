"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkExperiencePage() {
  const [data, setData] = useState({
    hasExperience: "yes",
    jobTitle: "",
    company: "",
    country: "",
    province: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isCurrent: false,
    details: "",
  });
  const router = useRouter();

  const onChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    router.push("/create/education");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">STEP 2</span>
        <h1 className="mt-3 text-2xl font-bold text-slate-800 md:text-3xl">2. ประสบการณ์ทำงาน</h1>
        <p className="mt-2 text-slate-600">บอกเราว่าคุณมีประสบการณ์ทำงานอย่างไร</p>

        <form onSubmit={handleNext} className="mt-6 grid gap-4">
          <fieldset className="rounded-lg border border-slate-300 p-4">
            <legend className="px-2 text-sm font-semibold text-slate-700">คุณมีประสบการณ์ทำงานหรือไม่?</legend>
            <div className="space-x-6">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input className="h-4 w-4" type="radio" name="hasExperience" value="yes" checked={data.hasExperience === "yes"} onChange={onChange("hasExperience")} />
                มี
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input className="h-4 w-4" type="radio" name="hasExperience" value="no" checked={data.hasExperience === "no"} onChange={onChange("hasExperience")} />
                ไม่มี
              </label>
            </div>
          </fieldset>

        {data.hasExperience === "yes" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">ตำแหน่งงานล่าสุด</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={data.jobTitle} onChange={onChange("jobTitle")} placeholder="เช่น Senior Developer" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">ชื่อบริษัท</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={data.company} onChange={onChange("company")} placeholder="เช่น Smart Persona Co., Ltd." />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">สถานที่</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={data.country} onChange={onChange("country")} placeholder="ประเทศ" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">จังหวัด</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={data.province} onChange={onChange("province")} placeholder="จังหวัด" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">เริ่ม</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="month" value={data.startYear && data.startMonth ? `${data.startYear}-${data.startMonth}` : ""} onChange={(e) => { const [y, m] = e.target.value.split("-"); setData((prev) => ({ ...prev, startYear: y, startMonth: m })); }} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">สิ้นสุด</label>
              <input className="rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="month" value={data.endYear && data.endMonth ? `${data.endYear}-${data.endMonth}` : ""} onChange={(e) => { const [y, m] = e.target.value.split("-"); setData((prev) => ({ ...prev, endYear: y, endMonth: m })); }} disabled={data.isCurrent} />
            </div>

            <div className="flex items-center gap-2">
              <input className="h-4 w-4" type="checkbox" checked={data.isCurrent} onChange={onChange("isCurrent")} id="currentJob" />
              <label htmlFor="currentJob" className="text-sm text-slate-700">ยังกำลังทำงานที่นี่</label>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">รายละเอียด</label>
              <textarea className="h-24 rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" value={data.details} onChange={onChange("details")} placeholder="สรุปหน้าที่และผลงาน" />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-between">
          <Link href="/create/personal-info">
            <button type="button" className="w-full rounded-lg border border-slate-300 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 md:w-auto">ย้อนกลับ</button>
          </Link>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 md:w-auto">ถัดไป</button>
        </div>
      </form>
    </div>
  </main>
  );
}
