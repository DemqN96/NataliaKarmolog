"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const blocks = [
  {
    num: "00",
    title: "Вступ та налаштування",
    tag: "БЛОК 0",
    lessons: ["Знайомство з курсом та ментором", "Як налаштуватись на трансформацію", "Правила роботи з матеріалом"],
  },
  {
    num: "01",
    title: "Фінансова карма",
    tag: "БЛОК 1",
    lessons: ["Що таке фінансова карма", "Як карма предків впливає на ваш достаток", "Практика: діагностика фінансових блоків", "Фінансова карма. Частина 2 — інструменти"],
  },
  {
    num: "02",
    title: "Психосоматика грошей",
    tag: "БЛОК 2",
    lessons: ["Тілесні патерни бідності", "Як тіло зберігає фінансові травми", "Практика: робота з тілом"],
  },
  {
    num: "03",
    title: "Перепрограмування",
    tag: "БЛОК 3",
    lessons: ["Нові фінансові переконання", "Техніки зміни підсвідомих програм", "Медитація достатку", "Підсумок та закріплення"],
  },
];

export default function ProgramSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "#1a1612", border: `1px solid ${open === i ? "rgba(201,168,76,0.35)" : "#2a2420"}` }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          {/* Header */}
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex items-center gap-5">
              <span className="text-2xl font-bold flex-shrink-0"
                style={{ color: open === i ? "#c9a84c" : "rgba(201,168,76,0.25)", fontFamily: "var(--font-playfair)" }}>
                {block.num}
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#6a5a50" }}>
                  {block.tag} · {block.lessons.length} уроки
                </p>
                <h3 className="font-bold text-base" style={{ color: "#f5f0e8", fontFamily: "var(--font-playfair)" }}>
                  {block.title}
                </h3>
              </div>
            </div>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-2xl flex-shrink-0 ml-4"
              style={{ color: "#c9a84c" }}
            >
              +
            </motion.span>
          </button>

          {/* Content */}
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-5 pt-1" style={{ borderTop: "1px solid #2a2420" }}>
                  <ul className="space-y-2.5 mt-3">
                    {block.lessons.map((lesson, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                          style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)" }}>
                          ▶
                        </span>
                        <span className="text-sm" style={{ color: "#a09080" }}>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
