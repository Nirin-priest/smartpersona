import Link from "next/link";

export default function CreateResumeHome() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 md:p-10 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
          เริ่มสร้าง Resume ของคุณ
        </h1>
        <p className="mt-3 text-slate-600">
          คลิกปุ่มด้านล่างเพื่อไปกรอกข้อมูลส่วนตัวก่อน
        </p>

        <Link href="/create/personal-info">
          <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
            เริ่มต้นกรอกข้อมูล
          </button>
        </Link>
      </div>
    </main>
  );
}
