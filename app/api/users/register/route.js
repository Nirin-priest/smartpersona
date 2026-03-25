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
      "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)";

    // ✅ FIX: hardcode roleId = 2 ที่ server ไม่ให้ client ส่งมาเองได้
    await query(sql, [username, hashPassword, 2]);

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
