import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import sql from "@/lib/db";

// GET /api/watched?email=...
export async function GET(req: NextRequest) {
  await initDB();
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json([], { status: 400 });
  const rows = await sql`SELECT lesson_id FROM watched WHERE email = ${email}`;
  return NextResponse.json(rows.map((r) => r.lesson_id as string));
}

// POST /api/watched  { email, lessonId }
export async function POST(req: NextRequest) {
  await initDB();
  const { email, lessonId } = await req.json();
  await sql`
    INSERT INTO watched (email, lesson_id)
    VALUES (${email}, ${lessonId})
    ON CONFLICT DO NOTHING
  `;
  return NextResponse.json({ ok: true });
}
