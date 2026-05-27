import { NextRequest, NextResponse } from "next/server";

// Proxy route for Google Drive audio files to avoid CORS issues
// Usage: /api/audio?id=GOOGLE_DRIVE_FILE_ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !/^[\w-]+$/.test(id)) {
    return new NextResponse("Missing or invalid id", { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;

  try {
    const upstream = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Range: req.headers.get("range") ?? "bytes=0-",
      },
      redirect: "follow",
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse("Failed to fetch audio", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "audio/mpeg";
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    };
    if (contentLength) headers["Content-Length"] = contentLength;
    if (contentRange) headers["Content-Range"] = contentRange;

    return new NextResponse(upstream.body, {
      status: upstream.status === 206 ? 206 : 200,
      headers,
    });
  } catch {
    return new NextResponse("Audio proxy error", { status: 502 });
  }
}
