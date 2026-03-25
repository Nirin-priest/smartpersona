import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

export async function POST(request) {
  try {
    // 1. รับค่าจาก body
    const { username, password } = await request.json();

    // 2. ตรวจสอบว่าส่งค่ามาครบไหม
    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing credentials" },
        { status: 400 },
      );
    }

    // 3. ดึงข้อมูล User จาก MySQL
    const sql = "SELECT * FROM users WHERE username = ?";
    const users = await query(sql, [username]);
    const user = users[0];

    // 4. ถ้าไม่เจอ User
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 5. ตรวจสอบรหัสผ่านด้วย bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 403 },
      );
    }

    // 6. สร้าง JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ FIX: เก็บ token ใน httpOnly cookie แทน sessionStorage (ป้องกัน XSS)
    const response = NextResponse.json({ message: "Success" }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 ชั่วโมง (วินาที)
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
