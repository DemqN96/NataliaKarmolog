"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession, type Student } from "@/lib/auth";
import { getLessons, getUnlockedDays } from "@/lib/lessons";
import { getWatched } from "@/lib/watched";
import { getNote } from "@/lib/notes";

interface Badge {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState({ lessons: 0, watched: 0, notes: 0, days: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    const lessons = getLessons();
    const watched = getWatched(session.email);
    const days = getUnlockedDays(session.startDate);

    // Count notes
    const noteCount = lessons.filter((l) => {
      const n = getNote(l.id, session.email);
      return n && n.trim().length > 0;
    }).length;

    setStudent(session);
    setStats({ lessons: lessons.length, watched: watched.length, notes: noteCount, days: Math.max(0, days) });

    const pct = lessons.length > 0 ? (watched.length / lessons.length) * 100 : 0;
    setBadges([
      {
        id: "first",
        icon: "🌱",
        title: "Перший крок",
        desc: "Переглянути перший урок",
        unlocked: watched.length >= 1,
      },
      {
        id: "halfway",
        icon: "⚡",
        title: "Середина шляху",
        desc: "Переглянути 50% курсу",
        unlocked: pct >= 50,
      },
      {
        id: "notes",
        icon: "✍️",
        title: "Нотатник",
        desc: "Зробити нотатки до 3 уроків",
        unlocked: noteCount >= 3,
      },
      {
        id: "streak",
        icon: "🔥",
        title: "Регулярність",
        desc: "7 днів у курсі",
        unlocked: days >= 7,
      },
      {
        id: "complete",
        icon: "👑",
        title: "Майстер достатку",
        desc: "Завершити весь курс",
        unlocked: pct >= 100,
      },
    ]);
  }, [router]);

  if (!student) return null;

  const progressPct = stats.lessons > 0 ? Math.round((stats.watched / stats.lessons) * 100) : 0;

  const statCards = [
    { label: "Переглянуто уроків", value: stats.watched, total: stats.lessons, icon: "▶" },
    { label: "Днів у курсі", value: stats.days + 1, icon: "📅" },
    { label: "Нотаток зроблено", value: stats.notes, icon: "✍" },
    { label: "Прогрес", value: `${progressPct}%`, icon: "✦" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ borderBottom: "1px solid #1e1a16", backgroundColor: "rgba(15,13,10,0.9)", backdropFilter: "blur(12px)" }}
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: "#a09080" }}>
            ← До курсу
          </button>
        </Link>
        <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          Мій <span style={{ color: "#c9a84c" }}>профіль</span>
        </h1>
        <div className="w-20" />
      </motion.header>

      <div className="max-w-2xl mx-auto px-5 py-10">

        {/* Avatar + name */}
        <motion.div
          className="flex items-center gap-5 mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.1))",
              border: "1.5px solid rgba(201,168,76,0.35)",
              fontFamily: "var(--font-playfair)",
              color: "#c9a84c",
            }}>
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>{student.name}</h2>
            <p className="text-sm" style={{ color: "#6a5a50" }}>{student.email}</p>
            <p className="text-xs mt-1" style={{ color: "#4a3a30" }}>
              Початок: {new Date(student.startDate).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium" style={{ color: "#d4c9b8" }}>Загальний прогрес</p>
            <span className="text-lg font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2420" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #c9a84c, #f0d080)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: "#4a3a30" }}>
            {stats.watched} з {stats.lessons} уроків переглянуто
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl p-4"
              style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
            >
              <p className="text-xs mb-1" style={{ color: "#4a3a30" }}>{s.icon} {s.label}</p>
              <p className="text-2xl font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
                {s.value}
                {"total" in s && <span className="text-sm font-normal" style={{ color: "#2a2420" }}> /{s.total}</span>}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
            Досягнення
          </h3>
          <div className="space-y-3">
            {badges.map((b, i) => (
              <motion.div
                key={b.id}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{
                  backgroundColor: b.unlocked ? "rgba(201,168,76,0.06)" : "#1a1612",
                  border: `1px solid ${b.unlocked ? "rgba(201,168,76,0.25)" : "#1e1a16"}`,
                  opacity: b.unlocked ? 1 : 0.45,
                }}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: b.unlocked ? 1 : 0.45, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    backgroundColor: b.unlocked ? "rgba(201,168,76,0.12)" : "#13110e",
                    border: `1.5px solid ${b.unlocked ? "rgba(201,168,76,0.35)" : "#2a2420"}`,
                  }}
                >
                  {b.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: b.unlocked ? "#f5f0e8" : "#3a2a20" }}>
                    {b.title}
                  </p>
                  <p className="text-xs" style={{ color: b.unlocked ? "#6a5a50" : "#2a2420" }}>{b.desc}</p>
                </div>
                {b.unlocked && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Complete link */}
        {progressPct >= 50 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link href="/complete">
              <button className="btn-gold px-8 py-4">
                👑 Отримати сертифікат →
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}
