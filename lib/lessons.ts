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
    title: "Як працює енергія грошей",
    block: "БЛОК 0",
    description: "Що таке егрегор фінансів. Загальний екскурс та логіка курсу. Правила навчання.",
    youtubeId: "0qTrWGZ8JmA",
    duration: "~20 хв",
  },
  {
    id: "2",
    day: 1,
    title: "Фінансова карма: духовний + науковий підхід",
    block: "БЛОК 1",
    description: "Що таке фінансова карма, як вона формується і чому багатство — це духовність.",
    youtubeId: "ire40-6Faus",
    duration: "~35 хв",
  },
  {
    id: "3",
    day: 2,
    title: "4 закони карми створення достатку",
    block: "БЛОК 1",
    description: "Закони карми та закони країни. Кармічні правила в бізнесі та роботі.",
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
