"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, logout, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, getUnlockedDays, type Lesson } from "@/lib/lessons";
import { getWatched, isWatched } from "@/lib/watched";
import UnlockCountdown from "@/components/UnlockCountdown";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setStudent(session);
    (async () => {
      const [all, w] = await Promise.all([getLessons(), getWatched(session.email)]);
      setLessons(all);
      setWatched(w);
    })();
  }, [router]);

  // scroll to active lesson
  useEffect(() => {
    if (activeRef.current) {
      setTimeout(() => activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 600);
    }
  }, [lessons]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!student) return null;

  const unlockedCount = lessons.filter((l) => isLessonUnlocked(l, student.startDate)).length;
  const watchedCount = watched.length;
  const progress = lessons.length > 0 ? (watchedCount / lessons.length) * 100 : 0;
  const dayNum = getUnlockedDays(student.startDate);

  // First unlocked but not yet watched
  const activeLessonId = lessons.find(
    (l) => isLessonUnlocked(l, student.startDate) && !watched.includes(l.id)
  )?.id ?? null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0806", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-3.5 sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.08)",
          backgroundColor: "rgba(10,8,6,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link href="/">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Стан <span className="text-gold-gradient">Достатку</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2.5">
          <Link href="/profile">
            <motion.div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))",
                border: "1.5px solid rgba(201,168,76,0.35)",
                color: "#c9a84c",
                fontFamily: "var(--font-playfair)",
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {student.name.charAt(0).toUpperCase()}
            </motion.div>
          </Link>
          <span className="text-sm hidden sm:block" style={{ color: "#5a4a40" }}>{student.name}</span>
          <Link href="/profile">
            <motion.button
              className="text-sm px-4 py-2 rounded-xl transition-all"
              style={{ color: "#c9a84c", border: "1px solid rgba(201,168,76,0.25)", backgroundColor: "rgba(201,168,76,0.05)" }}
              whileHover={{ backgroundColor: "rgba(201,168,76,0.1)", borderColor: "rgba(201,168,76,0.4)" }}
            >
              Профіль
            </motion.button>
          </Link>
          <motion.button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl transition-all"
            style={{ color: "#5a4a40", border: "1px solid #1e1a16" }}
            whileHover={{ color: "#7a6a60", borderColor: "#2a2420" }}
          >
            Вийти
          </motion.button>
        </div>
      </motion.header>

      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.07), transparent)" }} />

      <div className="max-w-3xl mx-auto px-5 py-10 relative">

        {/* Welcome */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "rgba(201,168,76,0.5)" }}>
            Особистий кабінет
          </p>
          <h2 className="text-3xl font-bold mb-1.5" style={{ fontFamily: "var(--font-playfair)" }}>
            Вітаємо, <span className="text-gold-gradient">{student.name}</span>!
          </h2>
          <p className="text-sm" style={{ color: "#5a4a40" }}>
            {dayNum < 0
              ? "Курс ще не розпочався — зовсім скоро ✦"
              : `День ${dayNum + 1} — продовжуйте, ви на правильному шляху ✦`}
          </p>
        </motion.div>

        {/* Progress card */}
        <motion.div
          className="rounded-2xl p-5 mb-8 flex items-center gap-6 relative overflow-hidden"
          style={{
            backgroundColor: "#13110d",
            border: "1px solid rgba(201,168,76,0.12)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.04) inset",
          }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Card inner glow */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: "radial-gradient(circle at 100% 0%, rgba(201,168,76,0.06), transparent 60%)" }} />
          {/* SVG Ring */}
          <div className="flex-shrink-0 relative">
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#2a2420" strokeWidth="7" />
              <g transform="rotate(-90 60 60)">
                <motion.circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="url(#ringGold)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 1.3, delay: 0.5, ease: "easeOut" as const }}
                />
              </g>
              <defs>
                <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#f0d080" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
                {Math.round(progress)}%
              </span>
              <span className="text-[10px]" style={{ color: "#4a3a30" }}>переглянуто</span>
            </div>
          </div>

          {/* Text info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1" style={{ color: "#d4c9b8" }}>Прогрес курсу</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
              {watchedCount} <span className="text-base font-normal" style={{ color: "#4a3a30" }}>/ {lessons.length}</span>
            </p>
            <p className="text-xs" style={{ color: "#6a5a50" }}>уроків переглянуто</p>
            {unlockedCount > watchedCount && (
              <p className="text-xs mt-1.5 px-2 py-0.5 rounded inline-block"
                style={{ color: "#c9a84c", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
                ✦ {unlockedCount - watchedCount} відкрито, але ще не переглянуто
              </p>
            )}
            {dayNum >= 0 && (
              <p className="text-xs mt-1.5" style={{ color: "#4a3a30" }}>
                День навчання <span style={{ color: "#c9a84c" }}>{dayNum + 1}</span>
              </p>
            )}
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-3">
          <AnimatePresence>
            {lessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(lesson, student.startDate);
              const watched_ = watched.includes(lesson.id);
              const isActive = lesson.id === activeLessonId;
              return (
                <motion.div
                  key={lesson.id}
                  ref={isActive ? activeRef : undefined}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.07 }}
                >
                  <LessonCard
                    lesson={lesson}
                    unlocked={unlocked}
                    watched={watched_}
                    isActive={isActive}
                    idx={idx}
                    startDate={student.startDate}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function LessonCard({
  lesson, unlocked, watched, isActive, idx, startDate,
}: {
  lesson: Lesson;
  unlocked: boolean;
  watched: boolean;
  isActive: boolean;
  idx: number;
  startDate: string;
}) {
  const router = useRouter();
  const num = String(idx + 1).padStart(2, "0");

  return (
    <motion.div
      className="rounded-2xl flex items-center gap-4 p-4 cursor-pointer relative overflow-hidden"
      style={{
        backgroundColor: isActive ? "#161210" : watched ? "#131108" : "#110f0c",
        border: `1px solid ${isActive ? "rgba(201,168,76,0.45)" : watched ? "rgba(201,168,76,0.12)" : unlocked ? "#1e1a10" : "#181410"}`,
        opacity: unlocked ? 1 : 0.45,
        boxShadow: isActive ? "0 4px 25px rgba(201,168,76,0.1), inset 0 0 30px rgba(201,168,76,0.03)" : "none",
      }}
      whileHover={unlocked ? {
        scale: 1.012,
        borderColor: isActive ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.3)",
        boxShadow: "0 8px 35px rgba(201,168,76,0.1)",
      } : {}}
      whileTap={unlocked ? { scale: 0.99 } : {}}
      transition={{ duration: 0.18 }}
      onClick={() => unlocked && router.push(`/lesson/${lesson.id}`)}
    >
      {/* Active shimmer line left */}
      {isActive && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: "linear-gradient(180deg, transparent, #c9a84c, transparent)" }} />
      )}
      {/* Active glow */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: "linear-gradient(105deg, rgba(201,168,76,0.05) 0%, transparent 55%)" }} />
      )}
      {/* Watched subtle tint */}
      {watched && !isActive && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: "linear-gradient(105deg, rgba(201,168,76,0.025) 0%, transparent 50%)" }} />
      )}

      {/* Number */}
      <span
        className="text-xs font-bold w-7 text-center flex-shrink-0"
        style={{ color: unlocked ? "#6a5a50" : "#2a2420", fontFamily: "var(--font-playfair)" }}
      >
        {num}
      </span>

      {/* Play/Lock/Check icon */}
      <motion.div
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: watched ? "rgba(201,168,76,0.15)" : unlocked ? "#201a08" : "#16120e",
          border: `1.5px solid ${watched ? "rgba(201,168,76,0.5)" : unlocked ? "#c9a84c" : "#2a2420"}`,
        }}
        whileHover={unlocked && !watched ? { scale: 1.1, rotate: 5 } : {}}
        transition={{ duration: 0.2 }}
      >
        {watched ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : unlocked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#c9a84c"><polygon points="5,3 19,12 5,21"/></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a3430" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        )}
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider"
            style={{
              backgroundColor: unlocked ? "rgba(201,168,76,0.1)" : "rgba(42,36,32,0.5)",
              border: `1px solid ${unlocked ? "rgba(201,168,76,0.2)" : "#2a2420"}`,
              color: unlocked ? "#c9a84c" : "#3a2a20",
            }}
          >
            {lesson.block}
          </span>
          {isActive && (
            <span className="text-[10px] font-medium" style={{ color: "#c9a84c" }}>← Продовжити</span>
          )}
        </div>
        <h3 className="font-semibold text-sm leading-tight" style={{
          color: unlocked ? "#f5f0e8" : "#3a2a20",
          fontFamily: "var(--font-playfair)",
        }}>
          {lesson.title}
        </h3>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#4a3a30" }}>
          {lesson.description}
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {lesson.duration && (
          <span
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
            style={{ backgroundColor: "#16120e", border: "1px solid #2a2420", color: "#5a4a40" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5a4a40" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {lesson.duration}
          </span>
        )}
        {watched ? (
          <p className="text-xs font-medium" style={{ color: "#c9a84c" }}>Переглянуто ✓</p>
        ) : unlocked ? (
          <p className="text-xs font-medium" style={{ color: "#c9a84c" }}>Дивитись →</p>
        ) : (
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-xs" style={{ color: "#2a2420" }}>День {lesson.day + 1}</p>
            <UnlockCountdown unlockDay={lesson.day} startDate={startDate} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
