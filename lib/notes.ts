const notesKey = (lessonId: string, email: string) =>
  `sd_note_${lessonId}_${email}`;

export function getNote(lessonId: string, email: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(notesKey(lessonId, email)) ?? "";
}

export function saveNote(lessonId: string, email: string, text: string): void {
  localStorage.setItem(notesKey(lessonId, email), text);
}
