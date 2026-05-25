"use client";

import { motion, type Variants } from "framer-motion";
import FadeIn from "./FadeIn";

const reviews = [
  {
    initials: "ВК",
    name: "Вікторія Кемпа",
    role: "Учасниця курсу",
    quote:
      "Я дякую тому дню, коли дізналася про Наталію, підписалася і придбала цей фантастичний курс. Дякую за чітку та зрозумілу подачу інформації. Ви змінюєте життя людей на краще!",
  },
  {
    initials: "АН",
    name: "Анонімно",
    role: "Учасниця курсу",
    quote:
      "Дякуємо, це відчувається у кожному уроці 🤍 Ви вклали величезну частинку своєї мудрої душі! І я ще раз собі дякую, що послухала свою інтуїцію і пішла навчатись до вас.",
  },
  {
    initials: "АН",
    name: "Анонімно",
    role: "Учасниця курсу",
    quote:
      "Наші відносини з батьком — це просто диво. Після зміни мого відношення він «став іншим»: спокійним, мирним. Це не передати словами. Цей курс — це просто мега. Я вже окупила його тричі… або й сотні раз.",
  },
  {
    initials: "АН",
    name: "Анонімно",
    role: "Учасниця курсу",
    quote:
      "Слухаю останній урок і кожні 3 хв сиджу з таким обличчям 🗿 Урок максимально роздупляючий, дійсно на вагу золота. Курс про гроші виявився курсом про життя!",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-4xl font-bold text-center mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
            Що кажуть учасниці
          </h2>
          <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
            Реальні відгуки людей, які вже проходять курс
          </p>
        </FadeIn>

        {/* Desktop: 2x2 grid */}
        <motion.div
          className="hidden md:grid md:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {reviews.map((r, i) => (
            <ReviewCard key={i} r={r} variants={item} />
          ))}
        </motion.div>

        {/* Mobile: horizontal scroll */}
        <div
          className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {reviews.map((r, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[82vw]">
              <ReviewCard r={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ r, variants }: { r: typeof reviews[0]; variants?: Variants }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -4, borderColor: "rgba(201,168,76,0.35)" }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
    >
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#c9a84c", fontSize: "0.85rem" }}>★</span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: "#c9b8a8" }}>
        «{r.quote}»
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid #2a2420" }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            backgroundColor: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.25)",
            color: "#c9a84c",
            fontFamily: "var(--font-playfair)",
          }}
        >
          {r.initials === "АН" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          ) : r.initials}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "#d4c9b8" }}>{r.name}</p>
          <p className="text-xs" style={{ color: "#4a3a30" }}>{r.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
