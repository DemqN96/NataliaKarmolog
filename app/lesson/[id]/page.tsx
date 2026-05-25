"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, type Lesson } from "@/lib/lessons";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    const all = getLessons();
    const found = all.find((l) => l.id === String(params.id));
    if (!found || !isLessonUnlocked(found, session.startDate)) { router.replace("/dashboard"); return; }
    setStudent(session);
    setLesson(found);
    setLessons(all);
  }, [router, params.id]);

  if (!lesson || !student) return null;

  const currentIndex = lessons.indexOf(lesson);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];
  const nextUnlocked = nextLesson && isLessonUnlocked(nextLesson, student.startDate);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ borderBottom: "1px solid #1e1a16", backgroundColor: "rgba(15,13,10,0.9)", backdropFilter: "blur(12px)" }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "#a09080" }}>
            ← Назад до курсу
          </button>
        </Link>
        <motion.span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ color: "#c9a84c", backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          {lesson.block}
        </motion.span>
      </motion.header>

      {/* Video */}
      <motion.div
        className="w-full"
        style={{ backgroundColor: "#000" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </motion.div>

      {/* Lesson info */}
      <motion.div
        className="max-w-4xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#c9a84c" }}>
          {lesson.block}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          {lesson.title}
        </h1>
        <p className="text-base" style={{ color: "#7a6a60" }}>{lesson.description}</p>

        {/* Navigation */}
        <div className="flex justify-between mt-12 gap-4">
          <div>
            {prevLesson && (
              <Link href={`/lesson/${prevLesson.id}`}>
                <motion.button
                  className="text-sm px-5 py-3 rounded-xl"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#d4c9b8" }}
                  whileHover={{ scale: 1.02, borderColor: "#3a3420" }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← {prevLesson.title}
                </motion.button>
              </Link>
            )}
          </div>
          <div>
            {nextLesson && (
              nextUnlocked ? (
                <Link href={`/lesson/${nextLesson.id}`}>
                  <motion.button
                    className="btn-gold text-sm px-5 py-3"
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  >
                    {nextLesson.title} →
                  </motion.button>
                </Link>
              ) : (
                <div className="text-sm px-5 py-3 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#4a3a30" }}>
                  🔒 Відкриється пізніше
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
