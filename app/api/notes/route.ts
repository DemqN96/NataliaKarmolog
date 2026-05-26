import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import sql from "@/lib/db";

// GET /api/notes?email=...&lessonId=...
export async function GET(req: NextRequest) {
  await initDB();
  const { searchParams } = new URL(req.url);
  const email    = searchParams.get("email");
  const lessonId = searchParams.get("lessonId");

  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  // Return all notes for email (for profile page count)
  if (!lessonId) {
    const rows = await sql`
      SELECT lesson_id, content FROM notes
      WHERE email = ${email} AND content != ''
    `;
    return NextResponse.json(rows);
  }

  // Return single note
  const rows = await sql`
    SELECT content FROM notes WHERE email = ${email} AND lesson_id = ${lessonId}
  `;
  return NextResponse.json({ content: (rows[0]?.content as string) ?? "" });
}

// POST /api/notes  { email, lessonId, content }
export async function POST(req: NextRequest) {
  await initDB();
  const { email, lessonId, content } = await req.json();
  await sql`
    INSERT INTO notes (email, lesson_id, content, updated_at)
    VALUES (${email}, ${lessonId}, ${content}, NOW())
    ON CONFLICT (email, lesson_id) DO UPDATE SET
      content    = EXCLUDED.content,
      updated_at = NOW()
  `;
  return NextResponse.json({ ok: true });
}
