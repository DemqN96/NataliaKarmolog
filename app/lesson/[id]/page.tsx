"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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

    if (!found) { router.replace("/dashboard"); return; }
    if (!isLessonUnlocked(found, session.startDate)) { router.replace("/dashboard"); return; }

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
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #2a2420" }}
      >
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-sm hover:opacity-80" style={{ color: "#a09080" }}>
            ← Назад до курсу
          </button>
        </Link>
        <span className="text-sm font-medium" style={{ color: "#c9a84c" }}>
          {lesson.block}
        </span>
      </header>

      {/* Video */}
      <div className="w-full" style={{ backgroundColor: "#000" }}>
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
      </div>

      {/* Lesson info */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#c9a84c" }}>
          {lesson.block}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{lesson.title}</h1>
        <p className="text-base" style={{ color: "#a09080" }}>{lesson.description}</p>

        {/* Navigation */}
        <div className="flex justify-between mt-10 gap-4">
          <div>
            {prevLesson && (
              <Link href={`/lesson/${prevLesson.id}`}>
                <button
                  className="text-sm px-5 py-3 rounded-lg"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#d4c9b8" }}
                >
                  ← {prevLesson.title}
                </button>
              </Link>
            )}
          </div>
          <div>
            {nextLesson && (
              nextUnlocked ? (
                <Link href={`/lesson/${nextLesson.id}`}>
                  <button className="btn-gold text-sm px-5 py-3">{nextLesson.title} →</button>
                </Link>
              ) : (
                <div
                  className="text-sm px-5 py-3 rounded-lg"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#5a4a40" }}
                >
                  🔒 Наступний урок відкриється пізніше
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
