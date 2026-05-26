export async function getNote(lessonId: string, email: string): Promise<string> {
  const res = await fetch(
    `/api/notes?email=${encodeURIComponent(email)}&lessonId=${encodeURIComponent(lessonId)}`
  );
  const data = await res.json();
  return data.content ?? "";
}

export async function saveNote(lessonId: string, email: string, text: string): Promise<void> {
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, lessonId, content: text }),
  });
}

export async function getNoteCount(email: string): Promise<number> {
  const res = await fetch(`/api/notes?email=${encodeURIComponent(email)}`);
  const rows = await res.json();
  return Array.isArray(rows) ? rows.length : 0;
}
