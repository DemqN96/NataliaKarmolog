"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, type Lesson } from "@/lib/lessons";
import { getNote, saveNote } from "@/lib/notes";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioError, setAudioError] = useState(false);

  // Notes state
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    const all = getLessons();
    const found = all.find((l) => l.id === String(params.id));
    if (!found || !isLessonUnlocked(found, session.startDate)) { router.replace("/dashboard"); return; }
    setStudent(session);
    setLesson(found);
    setLessons(all);
    setNote(getNote(String(params.id), session.email));
  }, [router, params.id]);

  // Auto-save notes with debounce
  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
    setNoteSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (student && lesson) {
        saveNote(lesson.id, student.email, value);
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
      }
    }, 800);
  }, [student, lesson]);

  // Audio helpers
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const val = Number(e.target.value);
    audio.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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

      {/* Lesson info + Audio + Notes */}
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
        <p className="text-base mb-10" style={{ color: "#7a6a60" }}>{lesson.description}</p>

        {/* ── Audio Player ── */}
        {lesson.audioUrl && !audioError && (
          <motion.div
            className="rounded-2xl p-6 mb-8"
            style={{ backgroundColor: "#1a1612", border: "1px solid rgba(201,168,76,0.2)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#c9a84c" }}>Аудіо до уроку</p>
                <p className="text-xs mt-0.5" style={{ color: "#4a3a30" }}>Слухайте де зручно — в дорозі, вдома</p>
              </div>
            </div>

            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={lesson.audioUrl}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
              onEnded={() => setIsPlaying(false)}
              onError={() => setAudioError(true)}
            />

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
                style={{ backgroundColor: "#c9a84c", boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0d0a">
                    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f0d0a">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                )}
              </button>

              {/* Time + Seek */}
              <div className="flex-1 min-w-0">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 rounded-full outline-none cursor-pointer"
                  style={{ accentColor: "#c9a84c" }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs" style={{ color: "#6a5a50" }}>{formatTime(currentTime)}</span>
                  <span className="text-xs" style={{ color: "#6a5a50" }}>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#6a5a50">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolume}
                  className="w-16 h-1 rounded-full outline-none cursor-pointer"
                  style={{ accentColor: "#c9a84c" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Notepad ── */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-10"
          style={{ border: "1px solid #2a2420" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {/* Notepad header */}
          <div className="flex items-center justify-between px-5 py-3"
            style={{ backgroundColor: "#1a1612", borderBottom: "1px solid #2a2420" }}>
            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#c9a84c">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
              </svg>
              <span className="text-xs uppercase tracking-widest" style={{ color: "#c9a84c" }}>Мої нотатки</span>
            </div>
            <span
              className="text-xs transition-opacity duration-300"
              style={{ color: "#4a3a30", opacity: noteSaved ? 1 : 0 }}
            >
              збережено ✓
            </span>
          </div>

          {/* Textarea */}
          <div style={{ backgroundColor: "#13110e" }}>
            <textarea
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Записуйте думки, інсайти, практики з цього уроку…&#10;&#10;Нотатки зберігаються автоматично."
              rows={7}
              className="w-full px-5 py-4 text-sm leading-relaxed outline-none resize-none"
              style={{
                backgroundColor: "transparent",
                color: "#d4c9b8",
                caretColor: "#c9a84c",
                fontFamily: "inherit",
              }}
            />
            {/* Line counter hint */}
            <div className="px-5 pb-3 flex justify-end">
              <span className="text-xs" style={{ color: "#2a2420" }}>
                {note.length > 0 ? `${note.length} симв.` : ""}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
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
