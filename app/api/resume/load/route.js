import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('id');

    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    const sql = `
      SELECT r.id, r.user_id, r.title, r.template, 
             c.config, c.personal, c.education, c.experience, c.summary, c.skills
      FROM resumes r
      LEFT JOIN resume_content c ON r.id = c.resume_id
      WHERE r.id = ? AND r.user_id = ?
    `;
    const results = await query(sql, [resumeId, user.id]);

    if (results.length === 0) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const row = results[0];
    
    // ✅ Increment view count every time the resume is loaded
    await query("UPDATE resumes SET views = views + 1 WHERE id = ?", [resumeId]);

    // Parse JSON strings to objects
    const data = {
      config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config || { template: row.template || "classic" },
      personal: typeof row.personal === 'string' ? JSON.parse(row.personal) : row.personal || { firstName: "", lastName: "", email: "", phone: "", address: "", profilePic: "" },
      education: typeof row.education === 'string' ? JSON.parse(row.education) : row.education || { degree: "", institution: "", gradYear: "", gpa: "" },
      experience: typeof row.experience === 'string' ? JSON.parse(row.experience) : row.experience || { company: "", position: "", details: "" },
      summary: typeof row.summary === 'string' ? JSON.parse(row.summary) : row.summary || { details: "" },
      skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills || { list: "" }
    };

    return NextResponse.json({ data, resumeId: row.id }, { status: 200 });
  } catch (error) {
    console.error("Load Resume Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
