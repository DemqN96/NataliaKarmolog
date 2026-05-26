import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import sql from "@/lib/db";

function row2lesson(r: Record<string, unknown>) {
  return {
    id: r.id as string,
    day: r.day as number,
    title: r.title as string,
    block: r.block as string,
    description: r.description as string,
    youtubeId: r.youtube_id as string,
    duration: r.duration as string,
    audioUrl: (r.audio_url as string) || undefined,
    homework: (r.homework as string) || undefined,
  };
}

// GET /api/lessons
export async function GET() {
  await initDB();
  const rows = await sql`SELECT * FROM lessons ORDER BY sort_order ASC, id ASC`;
  return NextResponse.json(rows.map(row2lesson));
}

// POST /api/lessons  { action: "add"|"move", ...data }
export async function POST(req: NextRequest) {
  await initDB();
  const body = await req.json();

  if (body.action === "add") {
    const { day, title, block, description, youtubeId, duration, audioUrl, homework } = body;
    const id = Date.now().toString();
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) AS m FROM lessons`;
    const sortOrder = Number(maxOrder[0].m) + 1;
    await sql`
      INSERT INTO lessons (id, day, sort_order, title, block, description, youtube_id, duration, audio_url, homework)
      VALUES (${id}, ${day ?? 0}, ${sortOrder}, ${title}, ${block}, ${description ?? ''}, ${youtubeId ?? ''}, ${duration ?? ''}, ${audioUrl || null}, ${homework || null})
    `;
    return NextResponse.json({ ok: true, id });
  }

  if (body.action === "move") {
    const { id, direction } = body; // direction: "up" | "down"
    const all = await sql`SELECT id, sort_order FROM lessons ORDER BY sort_order ASC`;
    const idx = all.findIndex((r) => r.id === id);
    if (idx < 0) return NextResponse.json({ ok: false, error: "not found" });

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= all.length) return NextResponse.json({ ok: true });

    const a = all[idx];
    const b = all[swapIdx];
    await sql`UPDATE lessons SET sort_order = ${b.sort_order} WHERE id = ${a.id}`;
    await sql`UPDATE lessons SET sort_order = ${a.sort_order} WHERE id = ${b.id}`;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}

// PUT /api/lessons — update lesson
export async function PUT(req: NextRequest) {
  await initDB();
  const { id, day, title, block, description, youtubeId, duration, audioUrl, homework } = await req.json();
  await sql`
    UPDATE lessons SET
      day         = ${day ?? 0},
      title       = ${title},
      block       = ${block},
      description = ${description ?? ''},
      youtube_id  = ${youtubeId ?? ''},
      duration    = ${duration ?? ''},
      audio_url   = ${audioUrl || null},
      homework    = ${homework || null}
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}

// DELETE /api/lessons?id=...
export async function DELETE(req: NextRequest) {
  await initDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await sql`DELETE FROM lessons WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
