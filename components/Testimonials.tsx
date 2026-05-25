"use client";

import { motion, type Variants } from "framer-motion";
import FadeIn from "./FadeIn";

const reviews = [
  {
    initials: "ОМ",
    name: "Оксана М.",
    role: "Підприємець",
    quote:
      "Після першого блоку я вже відчула, як знімаються старі страхи навколо грошей. Це не просто курс — це справжня трансформація.",
  },
  {
    initials: "ІЛ",
    name: "Ірина Л.",
    role: "Маркетолог",
    quote:
      "Техніки роботи з підсвідомим реально працюють. За кілька тижнів після курсу мій дохід суттєво виріс. Рекомендую від усього серця!",
  },
  {
    initials: "МВ",
    name: "Марина В.",
    role: "Мама двох дітей",
    quote:
      "Наталія пояснює складні речі так просто і з серцем. Я нарешті зрозуміла, чому гроші «не тримаються». Дякую за цей курс!",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-4xl font-bold text-center mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
            Відгуки учасників
          </h2>
          <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
            Реальні результати людей, які вже пройшли курс
          </p>
        </FadeIn>

        {/* Desktop grid / Mobile horizontal scroll */}
        <motion.div
          className="hidden md:grid md:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {reviews.map((r) => (
            <ReviewCard key={r.name} r={r} variants={item} />
          ))}
        </motion.div>

        {/* Mobile scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          {reviews.map((r) => (
            <div key={r.name} className="snap-start flex-shrink-0 w-[82vw]">
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
      whileHover={{ y: -5, borderColor: "rgba(201,168,76,0.35)" }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-6 flex flex-col gap-4 h-full"
      style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            backgroundColor: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#c9a84c",
            fontFamily: "var(--font-playfair)",
          }}
        >
          {r.initials}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#f5f0e8" }}>{r.name}</p>
          <p className="text-xs" style={{ color: "#6a5a50" }}>{r.role}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: "#c9a84c", fontSize: "0.85rem" }}>★</span>
        ))}
      </div>

      {/* Quote */}
      <p className="text-sm leading-relaxed italic flex-1" style={{ color: "#a09080" }}>
        «{r.quote}»
      </p>
    </motion.div>
  );
}
