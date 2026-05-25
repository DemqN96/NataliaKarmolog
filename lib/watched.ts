const KEY = (email: string) => `sd_watched_${email}`;

export function getWatched(email: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY(email)) ?? "[]");
  } catch {
    return [];
  }
}

export function markWatched(lessonId: string, email: string): void {
  const watched = getWatched(email);
  if (!watched.includes(lessonId)) {
    watched.push(lessonId);
    localStorage.setItem(KEY(email), JSON.stringify(watched));
  }
}

export function isWatched(lessonId: string, email: string): boolean {
  return getWatched(email).includes(lessonId);
}

export function getWatchedCount(email: string): number {
  return getWatched(email).length;
}
