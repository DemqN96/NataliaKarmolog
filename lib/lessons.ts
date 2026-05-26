export interface Lesson {
  id: string;
  day: number;
  title: string;
  block: string;
  description: string;
  youtubeId: string;
  duration: string;
  audioUrl?: string;
  homework?: string;
}

// ── CRUD via API ───────────────────────────────────────────────
export async function getLessons(): Promise<Lesson[]> {
  const res = await fetch("/api/lessons");
  return res.json();
}

export async function addLesson(lesson: Omit<Lesson, "id">): Promise<Lesson> {
  const res = await fetch("/api/lessons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", ...lesson }),
  });
  const data = await res.json();
  return { ...lesson, id: data.id };
}

export async function updateLesson(id: string, updates: Partial<Omit<Lesson, "id">>): Promise<void> {
  await fetch("/api/lessons", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
}

export async function deleteLesson(id: string): Promise<void> {
  await fetch(`/api/lessons?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function moveLessonUp(id: string): Promise<void> {
  await fetch("/api/lessons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "move", id, direction: "up" }),
  });
}

export async function moveLessonDown(id: string): Promise<void> {
  await fetch("/api/lessons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "move", id, direction: "down" }),
  });
}

// ── Pure helpers (no DB needed) ────────────────────────────────
export function getUnlockedDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function isLessonUnlocked(lesson: Lesson, startDate: string): boolean {
  return lesson.day <= getUnlockedDays(startDate);
}
