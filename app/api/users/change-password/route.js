import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new passwords are required" },
        { status: 400 }
      );
    }

    const sqlUser = "SELECT * FROM users WHERE id = ?";
    const users = await query(sqlUser, [currentUser.id]);
    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 403 }
      );
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const sqlUpdate = "UPDATE users SET password = ? WHERE id = ?";
    await query(sqlUpdate, [hashPassword, user.id]);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
