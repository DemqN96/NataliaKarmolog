export async function getWatched(email: string): Promise<string[]> {
  const res = await fetch(`/api/watched?email=${encodeURIComponent(email)}`);
  return res.json();
}

export async function markWatched(lessonId: string, email: string): Promise<void> {
  await fetch("/api/watched", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, lessonId }),
  });
}

export async function isWatched(lessonId: string, email: string): Promise<boolean> {
  const watched = await getWatched(email);
  return watched.includes(lessonId);
}

export async function getWatchedCount(email: string): Promise<number> {
  const watched = await getWatched(email);
  return watched.length;
}
