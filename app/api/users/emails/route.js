import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const sql = "INSERT INTO user_emails (user_id, email, is_primary) VALUES (?, ?, false)";
    await query(sql, [user.id, email]);

    return NextResponse.json({ message: "Email added successfully" }, { status: 201 });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "This email is already associated with an account" },
        { status: 409 },
      );
    }
    console.error("Add Email Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get('id');

    if (!emailId) {
      return NextResponse.json({ message: "Email ID is required" }, { status: 400 });
    }

    // Checking if the email belongs to the user and if it's primary
    const emailCheckSql = "SELECT * FROM user_emails WHERE id = ? AND user_id = ?";
    const emailCheck = await query(emailCheckSql, [emailId, user.id]);

    if(emailCheck.length === 0) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    if(emailCheck[0].is_primary) {
      return NextResponse.json({ message: "Cannot delete the primary email" }, { status: 400 });
    }

    const sql = "DELETE FROM user_emails WHERE id = ? AND user_id = ?";
    await query(sql, [emailId, user.id]);

    return NextResponse.json({ message: "Email removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Email Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
