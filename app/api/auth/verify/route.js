import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";

export async function GET(request) {
  // ✅ FIX: อ่าน token จาก httpOnly cookie แทน Authorization header
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    // ตรวจสอบ Token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // SQL JOIN ตามฟังก์ชัน getRoleNameByUserId
    const sql = `
      SELECT users.id, users.username AS name, roles.name AS role 
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      WHERE users.id = ?`;

    const result = await query(sql, [payload.id]);

    if (result.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Success", role: result[0].role, name: result[0].name },
      { status: 200 },
    );
  } catch (error) {
    // ✅ FIX: แยก error แต่ละประเภทออกจากกัน ไม่คืน 403 ทุกอย่าง
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token expired" }, { status: 401 });
    }
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
    console.error("GetUser Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
