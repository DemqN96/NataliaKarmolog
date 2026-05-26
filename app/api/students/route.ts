import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import sql from "@/lib/db";

function row2student(r: Record<string, unknown>) {
  return {
    email: r.email as string,
    name: r.name as string,
    password: r.password as string,
    startDate: r.start_date as string,
    certificateUnlocked: r.certificate_unlocked as boolean,
    birthday: (r.birthday as string) ?? undefined,
  };
}

// GET /api/students — list all
export async function GET() {
  await initDB();
  const rows = await sql`SELECT * FROM students ORDER BY name`;
  return NextResponse.json(rows.map(row2student));
}

// POST /api/students — add or upsert student
export async function POST(req: NextRequest) {
  await initDB();
  const { email, name, password, startDate } = await req.json();
  await sql`
    INSERT INTO students (email, name, password, start_date)
    VALUES (${email}, ${name}, ${password}, ${startDate})
    ON CONFLICT (email) DO UPDATE SET
      name       = EXCLUDED.name,
      password   = EXCLUDED.password,
      start_date = EXCLUDED.start_date
  `;
  return NextResponse.json({ ok: true });
}

// PUT /api/students — update specific fields (reset start date, toggle certificate, etc.)
export async function PUT(req: NextRequest) {
  await initDB();
  const { email, startDate, certificateUnlocked, password, birthday } = await req.json();

  if (startDate !== undefined) {
    await sql`UPDATE students SET start_date = ${startDate} WHERE email = ${email}`;
  }
  if (certificateUnlocked !== undefined) {
    await sql`UPDATE students SET certificate_unlocked = ${certificateUnlocked} WHERE email = ${email}`;
  }
  if (password !== undefined) {
    await sql`UPDATE students SET password = ${password} WHERE email = ${email}`;
  }
  if (birthday !== undefined) {
    await sql`UPDATE students SET birthday = ${birthday} WHERE email = ${email}`;
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/students?email=...
export async function DELETE(req: NextRequest) {
  await initDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  await sql`DELETE FROM students WHERE email = ${email}`;
  return NextResponse.json({ ok: true });
}
