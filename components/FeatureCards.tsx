"use client";

import { motion } from "framer-motion";

const features = [
  { icon: "🔓", title: "Відео по днях", desc: "Уроки відкриваються поступово — кожен день новий матеріал для глибокої інтеграції" },
  { icon: "🎯", title: "Практичні інструменти", desc: "Не тільки теорія — конкретні техніки та практики для реальної трансформації" },
  { icon: "💰", title: "Фінансова карма", desc: "Розберемо фінансові програми, які передаються через покоління" },
  { icon: "🌟", title: "Особистісне зростання", desc: "Комплексний підхід до створення життя достатку та гармонії" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function FeatureCards() {
  return (
    <motion.div
      className="grid md:grid-cols-3 gap-5"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          variants={item}
          whileHover={{
            y: -5,
            borderColor: "rgba(201,168,76,0.35)",
            boxShadow: "0 12px 40px rgba(201,168,76,0.09)",
          }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", cursor: "default" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl mb-4">{f.icon}</div>
          <h3 className="font-bold mb-2 text-base" style={{ color: "#f5f0e8", fontFamily: "var(--font-playfair)" }}>
            {f.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a60" }}>{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
