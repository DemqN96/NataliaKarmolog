"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, logout, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, getUnlockedDays, type Lesson } from "@/lib/lessons";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setStudent(session);
    setLessons(getLessons());
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!student) return null;

  const unlockedDays = getUnlockedDays(student.startDate);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #2a2420" }}
      >
        <Link href="/">
          <h1 className="text-xl font-bold">
            Стан <span style={{ color: "#c9a84c" }}>Достатку</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: "#a09080" }}>
            {student.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "#a09080", border: "1px solid #2a2420" }}
          >
            Вийти
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Вітаємо, {student.name}! 👋</h2>
          <p className="text-sm" style={{ color: "#a09080" }}>
            День навчання:{" "}
            <span style={{ color: "#c9a84c" }}>
              {unlockedDays < 0 ? "ще не розпочався" : `${unlockedDays + 1}`}
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "#d4c9b8" }}>Прогрес курсу</span>
            <span style={{ color: "#c9a84c" }}>
              {lessons.filter((l) => isLessonUnlocked(l, student.startDate)).length} /{" "}
              {lessons.length} уроків
            </span>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: "#2a2420" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: "#c9a84c",
                width: `${(lessons.filter((l) => isLessonUnlocked(l, student.startDate)).length / lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const unlocked = isLessonUnlocked(lesson, student.startDate);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                unlocked={unlocked}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

function LessonCard({ lesson, unlocked }: { lesson: Lesson; unlocked: boolean }) {
  const router = useRouter();

  return (
    <div
      className="rounded-xl p-5 flex items-center gap-5 transition-all"
      style={{
        backgroundColor: "#1a1612",
        border: `1px solid ${unlocked ? "#3a3020" : "#2a2420"}`,
        opacity: unlocked ? 1 : 0.6,
        cursor: unlocked ? "pointer" : "default",
      }}
      onClick={() => unlocked && router.push(`/lesson/${lesson.id}`)}
    >
      {/* Status icon */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{
          backgroundColor: unlocked ? "#2a2010" : "#1a1612",
          border: `2px solid ${unlocked ? "#c9a84c" : "#3a3430"}`,
        }}
      >
        {unlocked ? "▶" : "🔒"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#c9a84c" }}>
          {lesson.block}
        </p>
        <h3 className="font-semibold text-base" style={{ color: unlocked ? "#f5f0e8" : "#6a5a50" }}>
          {lesson.title}
        </h3>
        <p className="text-sm mt-1 truncate" style={{ color: "#7a6a60" }}>
          {lesson.description}
        </p>
      </div>

      {/* Duration & unlock indicator */}
      <div className="text-right flex-shrink-0">
        <p className="text-xs" style={{ color: "#a09080" }}>
          {lesson.duration}
        </p>
        {unlocked ? (
          <p className="text-xs mt-1" style={{ color: "#c9a84c" }}>
            Дивитись →
          </p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "#5a4a40" }}>
            День {lesson.day + 1}
          </p>
        )}
      </div>
    </div>
  );
}
