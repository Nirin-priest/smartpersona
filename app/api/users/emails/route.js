import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Checking if the email is already used by another user
    const emailCheckSql = "SELECT id FROM users WHERE email = ? AND id != ?";
    const emailCheck = await query(emailCheckSql, [email, user.id]);
    
    if (emailCheck.length > 0) {
       return NextResponse.json({ message: "This email is already associated with another account" }, { status: 409 });
    }

    // 1. Update users table
    const updateUserSql = "UPDATE users SET email = ? WHERE id = ?";
    await query(updateUserSql, [email, user.id]);

    // 2. Manage user_emails table
    // Check if primary email exists
    const primaryCheckSql = "SELECT id FROM user_emails WHERE user_id = ? AND is_primary = true";
    const primaryCheck = await query(primaryCheckSql, [user.id]);

    if (primaryCheck.length > 0) {
      // Update existing primary email
      const updatePrimarySql = "UPDATE user_emails SET email = ? WHERE id = ?";
      await query(updatePrimarySql, [email, primaryCheck[0].id]);
    } else {
      // If no primary email, create it
      const insertPrimarySql = "INSERT INTO user_emails (user_id, email, is_primary) VALUES (?, ?, true)";
      await query(insertPrimarySql, [user.id, email]);
    }

    return NextResponse.json({ message: "Email updated successfully" }, { status: 200 });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "This email is already associated with an account" },
        { status: 409 },
      );
    }
    console.error("Update Email Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
