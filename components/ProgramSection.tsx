"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const blocks = [
  {
    num: "00",
    title: "Вступ та налаштування на курс",
    tag: "БЛОК 0",
    lessons: [
      "Як працює енергія грошей",
      "Що таке егрегор фінансів",
      "Загальний екскурс та логіка курсу",
      "Правила навчання та відповідальність учасника",
      "Завдання",
    ],
  },
  {
    num: "01",
    title: "Фінансова карма та підсвідомість",
    tag: "БЛОК 1",
    lessons: [
      "Що таке фінансова карма: духовний + науковий підхід",
      "Як формується фінансова карма?",
      "Чому насправді багатство — це духовність?",
      "4 закони карми створення достатку",
      "Закони карми та закони країни: який взаємозв'язок?",
      "Кармічні правила в бізнесі та роботі",
    ],
  },
  {
    num: "02",
    title: "Борги, кредити та злив твоєї енергії",
    tag: "БЛОК 2",
    lessons: [
      "Звідки беруться борги та кредити (психологічно + енергетично)",
      "Борги як форма несвободи",
      "Куди зливається енергія",
      "Кроки, як позбутися боргів",
    ],
  },
  {
    num: "03",
    title: "Щедрість, вдячність та енергообмін",
    tag: "БЛОК 3",
    lessons: [
      "Як «жаба» (жадібність) блокує фінансовий потік",
      "Марнотратство vs щедрість: в чому різниця?",
      "Щедрість до себе",
      "Щедрість до інших",
      "Як благодійність реально впливає на достаток",
      "Вдячність як стан, а не ритуал",
      "Визнання власного успіху",
    ],
  },
  {
    num: "04",
    title: "Переконання та вторинні вигоди",
    tag: "БЛОК 4",
    lessons: [
      "Глибока робота з підсвідомістю",
      "Родові фінансові сценарії",
      "Рішення про гроші, прийняті в дитинстві",
      "Відношення до грошей та переконання",
      "Вторинні вигоди бідності",
      "Самосаботаж і страх росту",
      "Осудження достатку інших людей",
      "Самознецінення та заборона «мені не можна»",
    ],
  },
  {
    num: "05",
    title: "Свідомість (стан) достатку",
    tag: "БЛОК 5",
    lessons: [
      "Як мислення впливає на достаток",
      "Самооцінка та впевненість в собі",
      "Візуалізація, маніфестація та афірмації",
      "Як створювати результати за допомогою внутрішнього стану?",
      "Глибинний мотив: для чого мені достаток?",
      "Розширення свідомості через великі бажання і цілі",
      "Перевірка перед новим рівнем",
    ],
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
          transition={{ delay: i * 0.07, duration: 0.5 }}
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
                  {block.tag} · {block.lessons.length} {block.lessons.length === 1 ? "урок" : block.lessons.length < 5 ? "уроки" : "уроків"}
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
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="#c9a84c"><polygon points="5,3 19,12 5,21"/></svg>
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
