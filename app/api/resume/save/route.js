import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// ฟังก์ชันดึง user_id จาก JWT cookie
function getUserIdFromRequest(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

// POST /api/resume/save — บันทึก resume ใหม่ หรืออัปเดตถ้ามี resume_id แล้ว
export async function POST(request) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeId, data } = body; // data คือ object จาก ResumeContext

    const { config, personal, education, experience, summary, skills } = data;
    const template = config?.template || "classic";
    const title = personal?.firstName
      ? `${personal.firstName} ${personal.lastName || ""}`.trim() + " Resume"
      : "My Resume";

    if (resumeId) {
      // ===== UPDATE resume ที่มีอยู่แล้ว =====
      await query(
        "UPDATE resumes SET title = ?, template = ? WHERE id = ? AND user_id = ?",
        [title, template, resumeId, userId]
      );

      await query(
        `UPDATE resume_content 
         SET config = ?, personal = ?, education = ?, experience = ?, summary = ?, skills = ?
         WHERE resume_id = ?`,
        [
          JSON.stringify(config),
          JSON.stringify(personal),
          JSON.stringify(education),
          JSON.stringify(experience),
          JSON.stringify(summary),
          JSON.stringify(skills),
          resumeId,
        ]
      );

      return NextResponse.json({ message: "Saved", resumeId }, { status: 200 });
    } else {
      // ===== INSERT resume ใหม่ =====
      const newId = uuidv4();

      await query(
        "INSERT INTO resumes (id, user_id, title, template, status) VALUES (?, ?, ?, ?, 'Draft')",
        [newId, userId, title, template]
      );

      await query(
        `INSERT INTO resume_content (resume_id, config, personal, education, experience, summary, skills)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newId,
          JSON.stringify(config),
          JSON.stringify(personal),
          JSON.stringify(education),
          JSON.stringify(experience),
          JSON.stringify(summary),
          JSON.stringify(skills),
        ]
      );

      return NextResponse.json(
        { message: "Created", resumeId: newId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Save Resume Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
