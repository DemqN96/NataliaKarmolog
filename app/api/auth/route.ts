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

// POST /api/auth  { action: "login", email, password }
//                 { action: "update", currentEmail, updates: {...} }
export async function POST(req: NextRequest) {
  await initDB();
  const body = await req.json();

  if (body.action === "login") {
    const { email, password } = body;
    const rows = await sql`
      SELECT * FROM students
      WHERE lower(email) = lower(${email}) AND password = ${password}
    `;
    if (rows.length === 0) return NextResponse.json({ ok: false, error: "Невірний email або пароль" });
    return NextResponse.json({ ok: true, student: row2student(rows[0]) });
  }

  if (body.action === "update") {
    const { currentEmail, updates } = body;
    // Check email uniqueness if changing email
    if (updates.email && updates.email.toLowerCase() !== currentEmail.toLowerCase()) {
      const existing = await sql`SELECT email FROM students WHERE lower(email) = lower(${updates.email})`;
      if (existing.length > 0) return NextResponse.json({ ok: false, error: "Email вже зайнятий" });
    }
    await sql`
      UPDATE students SET
        email    = COALESCE(${updates.email ?? null}, email),
        password = COALESCE(${updates.password ?? null}, password),
        birthday = COALESCE(${updates.birthday ?? null}, birthday)
      WHERE email = ${currentEmail}
    `;
    const rows = await sql`SELECT * FROM students WHERE email = ${updates.email ?? currentEmail}`;
    if (rows.length === 0) return NextResponse.json({ ok: false, error: "Не знайдено" });
    return NextResponse.json({ ok: true, student: row2student(rows[0]) });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
