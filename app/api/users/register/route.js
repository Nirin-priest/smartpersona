import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    // ✅ FIX: ไม่รับ roleId จาก client (กำหนด default ที่ server เท่านั้น)
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (name, password, role) VALUES (?, ?, ?)";

    // ✅ Map username to name column, use built-in 'User' enum role
    await query(sql, [username, hashPassword, 'User']);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    // ✅ FIX: แยก duplicate entry ออกจาก server error เพื่อให้ frontend จับ 409 ได้
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 },
      );
    }
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
