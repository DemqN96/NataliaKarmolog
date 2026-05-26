import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export default sql;

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      email       TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      password    TEXT NOT NULL,
      start_date  TEXT NOT NULL,
      certificate_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
      birthday    TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS lessons (
      id          TEXT PRIMARY KEY,
      day         INTEGER NOT NULL DEFAULT 0,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      title       TEXT NOT NULL,
      block       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      youtube_id  TEXT NOT NULL DEFAULT '',
      duration    TEXT NOT NULL DEFAULT '',
      audio_url   TEXT,
      homework    TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS watched (
      email      TEXT NOT NULL,
      lesson_id  TEXT NOT NULL,
      watched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (email, lesson_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      email      TEXT NOT NULL,
      lesson_id  TEXT NOT NULL,
      content    TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (email, lesson_id)
    )
  `;

  // Seed default lessons if table is empty
  const count = await sql`SELECT COUNT(*) AS c FROM lessons`;
  if (Number(count[0].c) === 0) {
    await seedLessons();
  }
}

async function seedLessons() {
  const defaults = [
    { id: "1", day: 0, sort_order: 0, title: "Як працює енергія грошей", block: "БЛОК 0", description: "Що таке егрегор фінансів. Загальний екскурс та логіка курсу. Правила навчання.", youtube_id: "0qTrWGZ8JmA", duration: "40–60 хв", audio_url: null, homework: "Напишіть у нотатках: які правила навчання резонують з вами найбільше і чому. Що ви очікуєте від цього курсу? Яка ваша головна мета?" },
    { id: "2", day: 1, sort_order: 1, title: "Фінансова карма: духовний + науковий підхід", block: "БЛОК 1", description: "Що таке фінансова карма, як вона формується і чому багатство — це духовність.", youtube_id: "ire40-6Faus", duration: "40–60 хв", audio_url: null, homework: "Пригадайте 3 переломних моменти у вашому житті, які вплинули на ваше ставлення до грошей. Опишіть їх. Як ці події сформували вашу поточну фінансову реальність?" },
    { id: "3", day: 2, sort_order: 2, title: "4 закони карми створення достатку", block: "БЛОК 1", description: "Закони карми та закони країни. Кармічні правила в бізнесі та роботі.", youtube_id: "2QjMXXJT6JQ", duration: "40–60 хв", audio_url: null, homework: "Проаналізуйте: які з 4 законів карми ви порушуєте найчастіше у своєму житті та бізнесі? Що конкретно ви готові змінити вже сьогодні?" },
    { id: "4", day: 3, sort_order: 3, title: "СВІДОМІСТЬ (СТАН) ДОСТАТКУ", block: "БЛОК 5", description: "Як мислення впливає на достаток. Стан достатку як основа фінансового росту.", youtube_id: "E7KZS2HLHD0", duration: "40–60 хв", audio_url: null, homework: "Напишіть 10 речень, що починаються зі слів «Я живу в достатку, тому що…». Не думайте — пишіть одразу. Перечитайте вголос. Що відчуваєте?" },
    { id: "5", day: 4, sort_order: 4, title: "МИСЛЕННЯ ТА ПРАВИЛА БАГАТИХ ЛЮДЕЙ", block: "БЛОК 6", description: "Як думають багаті люди. Правила та патерни мислення для фінансового успіху.", youtube_id: "1YuepYI9c3k", duration: "40–60 хв", audio_url: null, homework: "Виберіть 3 правила мислення багатих людей, яких вам найбільше бракує. Для кожного напишіть: як ви думаєте зараз і як хочете думати після курсу." },
    { id: "6", day: 5, sort_order: 5, title: "Фінансовий достаток та батьки", block: "БЛОК 7", description: "Зв'язок між стосунками з батьками та фінансовим достатком. Родові сценарії.", youtube_id: "q8M7uP5YgUk", duration: "40–60 хв", audio_url: null, homework: "Пригадайте, яке ставлення до грошей було у вашій родині. Що говорили батьки про гроші? Як це вплинуло на вас? Напишіть лист подяки своїм батькам за все, що вони дали." },
    { id: "7", day: 6, sort_order: 6, title: "ГРОШІ В ПАРІ", block: "БЛОК 8", description: "Фінансова динаміка у стосунках. Гроші, партнер та спільний достаток.", youtube_id: "CutZ3KbUef8", duration: "40–60 хв", audio_url: null, homework: "Опишіть фінансову динаміку у ваших стосунках (або в минулих). Хто заробляє більше? Як ви ухвалюєте фінансові рішення разом? Що хочете змінити?" },
    { id: "8", day: 7, sort_order: 7, title: "Переконання та вторинні вигоди", block: "БЛОК 4", description: "Глибока робота з підсвідомістю. Родові фінансові сценарії, дитячі рішення про гроші та вторинні вигоди бідності.", youtube_id: "aHr_z4fOkBA", duration: "40–60 хв", audio_url: null, homework: "Запишіть 5 своїх переконань про гроші, які заважають вам багатіти. Для кожного знайдіть вторинну вигоду. Будьте чесні з собою." },
    { id: "9", day: 8, sort_order: 8, title: "БЛОК 4. ПЕРЕКОНАННЯ ТА ВТОРИННІ ВИГОДИ", block: "БЛОК 4", description: "Продовження роботи з переконаннями. Самосаботаж, страх росту та осудження достатку інших.", youtube_id: "WGp_nxfwl5U", duration: "40–60 хв", audio_url: null, homework: "Пригадайте 3 ситуації, коли ви свідомо або несвідомо саботували власний фінансовий ріст. Опишіть їх. Що стояло за цим страхом?" },
  ];

  for (const l of defaults) {
    await sql`
      INSERT INTO lessons (id, day, sort_order, title, block, description, youtube_id, duration, audio_url, homework)
      VALUES (${l.id}, ${l.day}, ${l.sort_order}, ${l.title}, ${l.block}, ${l.description}, ${l.youtube_id}, ${l.duration}, ${l.audio_url}, ${l.homework})
      ON CONFLICT (id) DO NOTHING
    `;
  }
}
