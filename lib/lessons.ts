export interface Lesson {
  id: string;
  day: number;
  title: string;
  block: string;
  description: string;
  youtubeId: string;
  duration: string;
  audioUrl?: string;
}

const LESSONS_KEY = "sd_lessons";

const DEFAULT_LESSONS: Lesson[] = [
  {
    id: "1",
    day: 0,
    title: "Вступ та налаштування на курс",
    block: "БЛОК 0",
    description: "Знайомство з курсом, з ментором та налаштування на трансформацію.",
    youtubeId: "0qTrWGZ8JmA",
    duration: "~20 хв",
  },
  {
    id: "2",
    day: 1,
    title: "Фінансова карма",
    block: "БЛОК 1",
    description: "Що таке фінансова карма і як вона впливає на ваш достаток.",
    youtubeId: "ire40-6Faus",
    duration: "~30 хв",
  },
  {
    id: "3",
    day: 2,
    title: "Фінансова карма. Частина 2",
    block: "БЛОК 1",
    description: "Продовження теми фінансової карми — практичні інструменти роботи.",
    youtubeId: "2QjMXXJT6JQ",
    duration: "~30 хв",
  },
];

export function getLessons(): Lesson[] {
  if (typeof window === "undefined") return DEFAULT_LESSONS;
  const raw = localStorage.getItem(LESSONS_KEY);
  if (!raw) {
    saveLessons(DEFAULT_LESSONS);
    return DEFAULT_LESSONS;
  }
  return JSON.parse(raw);
}

export function saveLessons(lessons: Lesson[]): void {
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
}

export function addLesson(lesson: Omit<Lesson, "id">): Lesson {
  const lessons = getLessons();
  const newLesson: Lesson = { ...lesson, id: Date.now().toString() };
  lessons.push(newLesson);
  saveLessons(lessons);
  return newLesson;
}

export function updateLesson(id: string, updates: Partial<Omit<Lesson, "id">>): void {
  const lessons = getLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx >= 0) {
    lessons[idx] = { ...lessons[idx], ...updates };
    saveLessons(lessons);
  }
}

export function deleteLesson(id: string): void {
  saveLessons(getLessons().filter((l) => l.id !== id));
}

export function moveLessonUp(id: string): void {
  const lessons = getLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx > 0) {
    [lessons[idx - 1], lessons[idx]] = [lessons[idx], lessons[idx - 1]];
    // re-assign day numbers by position
    saveLessons(lessons);
  }
}

export function moveLessonDown(id: string): void {
  const lessons = getLessons();
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx < lessons.length - 1) {
    [lessons[idx], lessons[idx + 1]] = [lessons[idx + 1], lessons[idx]];
    saveLessons(lessons);
  }
}

export function getUnlockedDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function isLessonUnlocked(lesson: Lesson, startDate: string): boolean {
  return lesson.day <= getUnlockedDays(startDate);
}
