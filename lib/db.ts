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

  // Always upsert canonical lessons so deploys stay in sync with DB
  await seedLessons();
}

async function seedLessons() {
  const defaults = [
    {
      id: "1", day: 0, sort_order: 0,
      title: "Вступ та налаштування на курс",
      block: "БЛОК 0",
      description: "Що таке егрегор фінансів. Загальний екскурс та логіка курсу. Правила навчання та відповідальність учасника. Налаштування на роботу зі свідомістю.",
      youtube_id: "0qTrWGZ8JmA", duration: "40–60 хв",
      homework: "Напишіть у нотатках: які правила навчання резонують з вами найбільше і чому. Що ви очікуєте від цього курсу? Яка ваша головна мета?",
    },
    {
      id: "2", day: 3, sort_order: 1,
      title: "Фінансова карма: духовний + науковий підхід",
      block: "БЛОК 1",
      description: "Що таке фінансова карма, як вона формується і чому багатство — це духовність. Біблія і карма.",
      youtube_id: "ire40-6Faus", duration: "40–60 хв",
      homework: "Пригадайте 3 переломних моменти у вашому житті, які вплинули на ваше ставлення до грошей. Опишіть їх. Як ці події сформували вашу поточну фінансову реальність?",
    },
    {
      id: "3", day: 6, sort_order: 2,
      title: "4 закони карми створення достатку",
      block: "БЛОК 1",
      description: "Чому насправді багатство — це духовність? 4 закони карми. Закони карми та закони країни. Кармічні правила в бізнесі та роботі.",
      youtube_id: "2QjMXXJT6JQ", duration: "40–60 хв",
      homework: "Проаналізуйте: які з 4 законів карми ви порушуєте найчастіше у своєму житті та бізнесі? Що конкретно ви готові змінити вже сьогодні?",
    },
    {
      id: "4", day: 9, sort_order: 3,
      title: "Борги, кредити та злив твоєї енергії",
      block: "БЛОК 2",
      description: "Звідки беруться борги та кредити (психологічно + енергетично). Борги як форма несвободи. Куди зливається енергія. Кроки, як позбутися боргів. Техніка «4 сили».",
      youtube_id: "00Wzb8GFnnk", duration: "40–60 хв",
      homework: "Складіть список усіх своїх боргів — грошових та енергетичних (кому ви щось винні, хто винен вам). Для кожного запишіть: як це впливає на ваш фінансовий стан?",
    },
    {
      id: "5", day: 12, sort_order: 4,
      title: "Щедрість, вдячність та енергообмін",
      block: "БЛОК 3",
      description: "Як «жаба» (жадібність) блокує фінансовий потік. Марнотратство vs щедрість. Щедрість до себе та інших. Як благодійність впливає на достаток. Вдячність як стан.",
      youtube_id: "J14_hDEqVSk", duration: "40–60 хв",
      homework: "Практика «Енергія вдячності»: щодня протягом тижня записуйте 5 речей, за які ви вдячні — у сфері грошей і достатку. Зробіть один щедрий вчинок сьогодні.",
    },
    {
      id: "6", day: 15, sort_order: 5,
      title: "Переконання та вторинні вигоди. Частина 1",
      block: "БЛОК 4",
      description: "Чому ти досі не заробляєш більше? Рішення про гроші, прийняті в дитинстві. Відношення до грошей та переконання. Самосаботаж і страх росту.",
      youtube_id: "WGp_nxfwl5U", duration: "40–60 хв",
      homework: "Запишіть 5 своїх переконань про гроші, які заважають вам багатіти. Звідки вони взялися? Хто в дитинстві транслював ці установки?",
    },
    {
      id: "7", day: 18, sort_order: 6,
      title: "Переконання та вторинні вигоди. Частина 2",
      block: "БЛОК 4",
      description: "Вторинні вигоди бідності. Осудження достатку інших людей. Самознецінення та заборона «мені не можна».",
      youtube_id: "aHr_z4fOkBA", duration: "40–60 хв",
      homework: "Для кожного свого обмежувального переконання знайдіть вторинну вигоду. Будьте чесні з собою. Напишіть нову формулювання-замінник для кожного переконання.",
    },
    {
      id: "8", day: 21, sort_order: 7,
      title: "Свідомість (стан) достатку",
      block: "БЛОК 5",
      description: "Як мислення впливає на достаток. Самооцінка та впевненість в собі. Візуалізація, маніфестація та афірмації. Практика «Маніфестація бажань». Медитація самоцінність.",
      youtube_id: "E7KZS2HLHD0", duration: "40–60 хв",
      audio_url: "/api/audio?id=1wc0rjXvyg1kYOeVshFwCOCpk9tHRQOPo",
      homework: "Напишіть 10 речень: «Я живу в достатку, тому що…». Не думайте — пишіть одразу. Перечитайте вголос. Запишіть свої 3 головні цілі — фінансові та особисті.",
    },
    {
      id: "9", day: 24, sort_order: 8,
      title: "Мислення та правила багатих людей",
      block: "БЛОК 6",
      description: "Звички бідності vs звички багатства. Швидкість прийняття рішень. Ставлення до помилок і втрат. Реакція на кризи. Тета-практика «Фінансові загрузки».",
      youtube_id: "1YuepYI9c3k", duration: "40–60 хв",
      homework: "Виберіть 3 правила мислення багатих людей, яких вам найбільше бракує. Для кожного напишіть: як ви думаєте зараз і як хочете думати після курсу.",
    },
    {
      id: "10", day: 27, sort_order: 9,
      title: "Фінансовий достаток та батьки",
      block: "БЛОК 7",
      description: "Зв'язок з батьками і фінансовий потік, ієрархія, сепарація на 3 рівнях. Лояльність до мами/тата. Родові фінансові сценарії. Практика «Прийняття батьків».",
      youtube_id: "q8M7uP5YgUk", duration: "40–60 хв",
      homework: "Напишіть лист подяки кожному з батьків — за фінансові уроки, які вони дали вам (навіть через обмеження). Зробіть практику «Прийняття батьків» із відео.",
    },
    {
      id: "11", day: 30, sort_order: 10,
      title: "Гроші в парі",
      block: "БЛОК 8",
      description: "Фінансові сценарії у стосунках. Як вибір партнера впливає на достаток. Баланс «давати–брати». Фінансова залежність vs партнерство. Чому любов ≠ рятування.",
      youtube_id: "CutZ3KbUef8", duration: "40–60 хв",
      homework: "Опишіть фінансову динаміку у ваших стосунках. Хто заробляє більше? Чи є фінансова рівність? Що хочете змінити? Поговоріть із партнером про спільні фінансові цілі.",
    },
    {
      id: "12", day: 33, sort_order: 11,
      title: "Гроші та призначення",
      block: "БЛОК 9",
      description: "Чи існують гроші в легкості? Зв'язок призначення і достатку. Коли робота перестає бути каторгою. Чому «моє» завжди приносить більше.",
      youtube_id: "JgDcZ_escM0", duration: "40–60 хв",
      homework: "Напишіть: що є вашим призначенням? Як воно пов'язане з грошима? Які кроки ви зробите цього тижня, щоб наблизитись до роботи за покликанням?",
    },
  ];

  for (const l of defaults) {
    const audioUrl = (l as { audio_url?: string }).audio_url ?? null;
    await sql`
      INSERT INTO lessons (id, day, sort_order, title, block, description, youtube_id, duration, audio_url, homework)
      VALUES (${l.id}, ${l.day}, ${l.sort_order}, ${l.title}, ${l.block}, ${l.description}, ${l.youtube_id}, ${l.duration}, ${audioUrl}, ${l.homework})
      ON CONFLICT (id) DO UPDATE SET
        day         = EXCLUDED.day,
        sort_order  = EXCLUDED.sort_order,
        title       = EXCLUDED.title,
        block       = EXCLUDED.block,
        description = EXCLUDED.description,
        youtube_id  = EXCLUDED.youtube_id,
        duration    = EXCLUDED.duration,
        audio_url   = COALESCE(lessons.audio_url, EXCLUDED.audio_url),
        homework    = EXCLUDED.homework
    `;
  }
}
