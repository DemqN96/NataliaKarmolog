"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, logout, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, getUnlockedDays, type Lesson } from "@/lib/lessons";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    setStudent(session);
    setLessons(getLessons());
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!student) return null;

  const unlockedCount = lessons.filter((l) => isLessonUnlocked(l, student.startDate)).length;
  const progress = lessons.length > 0 ? (unlockedCount / lessons.length) * 100 : 0;
  const dayNum = getUnlockedDays(student.startDate);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ borderBottom: "1px solid #1e1a16", backgroundColor: "rgba(15,13,10,0.9)", backdropFilter: "blur(12px)" }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link href="/">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Стан <span style={{ color: "#c9a84c" }}>Достатку</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{ color: "#7a6a60" }}>{student.name}</span>
          <button onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg transition-all hover:opacity-70"
            style={{ color: "#7a6a60", border: "1px solid #2a2420" }}>
            Вийти
          </button>
        </div>
      </motion.header>

      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* Welcome */}
        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
            Вітаємо, {student.name}! 👋
          </h2>
          <p className="text-sm" style={{ color: "#7a6a60" }}>
            {dayNum < 0
              ? "Курс ще не розпочався"
              : `День навчання: `}
            {dayNum >= 0 && <span style={{ color: "#c9a84c" }}>{dayNum + 1}</span>}
          </p>
        </motion.div>

        {/* Progress card */}
        <motion.div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between text-sm mb-3">
            <span style={{ color: "#d4c9b8" }}>Прогрес курсу</span>
            <span style={{ color: "#c9a84c", fontWeight: 600 }}>
              {unlockedCount} / {lessons.length} уроків
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: "#2a2420" }}>
            <motion.div
              className="h-2 rounded-full"
              style={{ background: "linear-gradient(90deg, #c9a84c, #f0d080)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-3">
          <AnimatePresence>
            {lessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(lesson, student.startDate);
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
                >
                  <LessonCard lesson={lesson} unlocked={unlocked} idx={idx} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function LessonCard({ lesson, unlocked, idx }: { lesson: Lesson; unlocked: boolean; idx: number }) {
  const router = useRouter();

  return (
    <motion.div
      className="rounded-2xl flex items-center gap-4 p-5 cursor-pointer"
      style={{
        backgroundColor: "#1a1612",
        border: `1px solid ${unlocked ? "#2a2010" : "#1e1a16"}`,
        opacity: unlocked ? 1 : 0.55,
      }}
      whileHover={unlocked ? {
        scale: 1.01,
        borderColor: "rgba(201,168,76,0.35)",
        boxShadow: "0 8px 30px rgba(201,168,76,0.08)",
      } : {}}
      whileTap={unlocked ? { scale: 0.99 } : {}}
      transition={{ duration: 0.2 }}
      onClick={() => unlocked && router.push(`/lesson/${lesson.id}`)}
    >
      {/* Icon */}
      <motion.div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
        style={{
          backgroundColor: unlocked ? "#201a08" : "#1a1612",
          border: `2px solid ${unlocked ? "#c9a84c" : "#3a3430"}`,
        }}
        whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
        transition={{ duration: 0.2 }}
      >
        {unlocked ? "▶" : "🔒"}
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "#c9a84c" }}>
          {lesson.block}
        </p>
        <h3 className="font-semibold text-sm" style={{
          color: unlocked ? "#f5f0e8" : "#4a3a30",
          fontFamily: "var(--font-playfair)",
        }}>
          {lesson.title}
        </h3>
        <p className="text-xs mt-0.5 truncate" style={{ color: "#5a4a40" }}>
          {lesson.description}
        </p>
      </div>

      {/* Right */}
      <div className="text-right flex-shrink-0">
        <p className="text-xs" style={{ color: "#7a6a60" }}>{lesson.duration}</p>
        {unlocked ? (
          <p className="text-xs mt-1 font-medium" style={{ color: "#c9a84c" }}>Дивитись →</p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "#3a2a20" }}>День {lesson.day + 1}</p>
        )}
      </div>
    </motion.div>
  );
}
