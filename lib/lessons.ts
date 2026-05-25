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

const LESSONS_KEY = "sd_lessons";

const DEFAULT_LESSONS: Lesson[] = [
  {
    id: "1",
    day: 0,
    title: "Як працює енергія грошей",
    block: "БЛОК 0",
    description: "Що таке егрегор фінансів. Загальний екскурс та логіка курсу. Правила навчання.",
    youtubeId: "0qTrWGZ8JmA",
    duration: "40–60 хв",
    homework: "Напишіть у нотатках: які правила навчання резонують з вами найбільше і чому. Що ви очікуєте від цього курсу? Яка ваша головна мета?",
  },
  {
    id: "2",
    day: 1,
    title: "Фінансова карма: духовний + науковий підхід",
    block: "БЛОК 1",
    description: "Що таке фінансова карма, як вона формується і чому багатство — це духовність.",
    youtubeId: "ire40-6Faus",
    duration: "40–60 хв",
    homework: "Пригадайте 3 переломних моменти у вашому житті, які вплинули на ваше ставлення до грошей. Опишіть їх. Як ці події сформували вашу поточну фінансову реальність?",
  },
  {
    id: "3",
    day: 2,
    title: "4 закони карми створення достатку",
    block: "БЛОК 1",
    description: "Закони карми та закони країни. Кармічні правила в бізнесі та роботі.",
    youtubeId: "2QjMXXJT6JQ",
    duration: "40–60 хв",
    homework: "Проаналізуйте: які з 4 законів карми ви порушуєте найчастіше у своєму житті та бізнесі? Що конкретно ви готові змінити вже сьогодні?",
  },
  {
    id: "4",
    day: 3,
    title: "СВІДОМІСТЬ (СТАН) ДОСТАТКУ",
    block: "БЛОК 5",
    description: "Як мислення впливає на достаток. Стан достатку як основа фінансового росту.",
    youtubeId: "E7KZS2HLHD0",
    duration: "40–60 хв",
    homework: "Напишіть 10 речень, що починаються зі слів «Я живу в достатку, тому що…». Не думайте — пишіть одразу. Перечитайте вголос. Що відчуваєте?",
  },
  {
    id: "5",
    day: 4,
    title: "МИСЛЕННЯ ТА ПРАВИЛА БАГАТИХ ЛЮДЕЙ",
    block: "БЛОК 6",
    description: "Як думають багаті люди. Правила та патерни мислення для фінансового успіху.",
    youtubeId: "1YuepYI9c3k",
    duration: "40–60 хв",
    homework: "Виберіть 3 правила мислення багатих людей, яких вам найбільше бракує. Для кожного напишіть: як ви думаєте зараз і як хочете думати після курсу.",
  },
  {
    id: "6",
    day: 5,
    title: "Фінансовий достаток та батьки",
    block: "БЛОК 7",
    description: "Зв'язок між стосунками з батьками та фінансовим достатком. Родові сценарії.",
    youtubeId: "q8M7uP5YgUk",
    duration: "40–60 хв",
    homework: "Пригадайте, яке ставлення до грошей було у вашій родині. Що говорили батьки про гроші? Як це вплинуло на вас? Напишіть лист подяки своїм батькам за все, що вони дали.",
  },
  {
    id: "7",
    day: 6,
    title: "ГРОШІ В ПАРІ",
    block: "БЛОК 8",
    description: "Фінансова динаміка у стосунках. Гроші, партнер та спільний достаток.",
    youtubeId: "CutZ3KbUef8",
    duration: "40–60 хв",
    homework: "Опишіть фінансову динаміку у ваших стосунках (або в минулих). Хто заробляє більше? Як ви ухвалюєте фінансові рішення разом? Що хочете змінити?",
  },
  {
    id: "8",
    day: 7,
    title: "Переконання та вторинні вигоди",
    block: "БЛОК 4",
    description: "Глибока робота з підсвідомістю. Родові фінансові сценарії, дитячі рішення про гроші та вторинні вигоди бідності.",
    youtubeId: "aHr_z4fOkBA",
    duration: "40–60 хв",
    homework: "Запишіть 5 своїх переконань про гроші, які заважають вам багатіти. Для кожного знайдіть вторинну вигоду — що ви «отримуєте» від того, що залишаєтесь бідними? Будьте чесні з собою.",
  },
  {
    id: "9",
    day: 8,
    title: "БЛОК 4. ПЕРЕКОНАННЯ ТА ВТОРИННІ ВИГОДИ",
    block: "БЛОК 4",
    description: "Продовження роботи з переконаннями. Самосаботаж, страх росту та осудження достатку інших.",
    youtubeId: "WGp_nxfwl5U",
    duration: "40–60 хв",
    homework: "Пригадайте 3 ситуації, коли ви свідомо або несвідомо саботували власний фінансовий ріст. Опишіть їх. Що стояло за цим страхом? Що ви готові змінити зараз?",
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
