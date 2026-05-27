"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

const faqs = [
  {
    q: "Скільки часу потрібно на курс?",
    a: "Кожен урок займає 60 хвилин. Нові уроки відкриваються 2 рази в тиждень, ви рухаєтесь у власному темпі без поспіху.",
  },
  {
    q: "Чи підходить курс, якщо я нічого не знаю про кармологію?",
    a: "Так, курс розроблений з нуля. Наталія пояснює все простою мовою без езотерики — тільки практичні інструменти.",
  },
  {
    q: "Скільки триває курс?",
    a: "2 місяці",
  },
  {
    q: "Що якщо я пропущу день?",
    a: "Нічого страшного — уроки зберігаються і доступні для перегляду в будь-який час після відкриття.",
  },
  {
    q: "Як отримати доступ після оплати?",
    a: "Після оплати напишіть нам, ми надамо вам email та пароль для входу на платформу протягом кількох годин.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => (
        <FadeIn key={i} delay={i * 0.06}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#1a1612",
              border: `1px solid ${open === i ? "rgba(201,168,76,0.35)" : "#2a2420"}`,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-medium text-sm pr-4" style={{ color: "#f5f0e8" }}>
                {item.q}
              </span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-xl flex-shrink-0"
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
                  transition={{ duration: 0.32, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-5 pb-4 pt-1" style={{ borderTop: "1px solid #2a2420" }}>
                    <p className="text-sm leading-relaxed mt-3" style={{ color: "#7a6a60" }}>
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </FadeIn>
      ))}
    </div>
  );
}
