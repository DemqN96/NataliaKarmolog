"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, hasCertificateAccess, type Student } from "@/lib/auth";

const CONFETTI_COUNT = 60;

const CONFETTI_COLORS = [
  "#c9a84c", "#f0d080", "#e8c96a", "#ffd700",
  "#f5f0e8", "#d4c9b8", "#b8905c", "#a07830",
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Confetti() {
  const pieces = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: rand(0, 100),
    delay: rand(0, 3),
    duration: rand(3, 7),
    size: rand(6, 14),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: rand(-180, 180),
    shape: Math.random() > 0.5 ? "square" : "circle",
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.shape === "square" ? p.size : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            opacity: 0.8,
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0.9, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function CompletePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [show, setShow] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    (async () => {
      const certAccess = await hasCertificateAccess(session.email);
      if (!certAccess) { router.replace("/profile"); return; }
      setStudent(session);
      setTimeout(() => setShow(true), 100);
    })();
  }, [router]);

  const completionDate = new Date().toLocaleDateString("uk-UA", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (!student) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#0a0806" }}>

      <Confetti />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 65%)" }} />

      <AnimatePresence>
        {show && (
          <motion.div
            className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Crown icon */}
            <motion.div
              className="mb-6"
              animate={{ rotate: [-5, 5, -5], y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#c9a84c">
                <path d="M5 16L3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/>
              </svg>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-3"
              style={{ fontFamily: "var(--font-playfair)", color: "#c9a84c",
                textShadow: "0 0 60px rgba(201,168,76,0.4)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Вітаємо!
            </motion.h1>

            <motion.p
              className="text-xl mb-10"
              style={{ color: "#a09080" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Ти завершила курс «Стан Достатку»
            </motion.p>

            {/* Certificate card */}
            <motion.div
              ref={printRef}
              className="w-full rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
              style={{
                backgroundColor: "#1a1612",
                border: "1px solid rgba(201,168,76,0.35)",
                boxShadow: "0 0 80px rgba(201,168,76,0.1), 0 30px 60px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Corner ornaments */}
              {[
                "top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"
              ].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-6 h-6`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1">
                    <path d="M0 12 L12 0 L24 12 L12 24 Z" />
                  </svg>
                </div>
              ))}

              {/* Glow line top */}
              <div className="w-32 h-0.5 mx-auto mb-8 rounded"
                style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />

              <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: "#6a5a50" }}>
                Сертифікат про завершення
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
                {student.name}
              </h2>
              <p className="text-sm mb-6" style={{ color: "#6a5a50" }}>
                успішно завершила повний курс
              </p>
              <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)", color: "#c9a84c" }}>
                «Стан Достатку»
              </h3>
              <p className="text-sm mb-6" style={{ color: "#4a3a30" }}>
                Автор: Войтович Наталія · Кармолог
              </p>

              {/* Date */}
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>{completionDate}</p>
                  <p className="text-xs" style={{ color: "#4a3a30" }}>дата завершення</p>
                </div>
              </div>

              {/* Glow line bottom */}
              <div className="w-32 h-0.5 mx-auto rounded"
                style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={() => window.print()}
                className="btn-gold flex-1 py-4 text-sm"
              >
                🖨 Зберегти сертифікат
              </button>
              <Link href="/dashboard" className="flex-1">
                <button
                  className="w-full py-4 rounded-lg text-sm transition-all hover:opacity-80"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#a09080" }}
                >
                  ← Назад до курсу
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
