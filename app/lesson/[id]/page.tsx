"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession, type Student } from "@/lib/auth";
import { getLessons, isLessonUnlocked, type Lesson } from "@/lib/lessons";
import { getNote, saveNote } from "@/lib/notes";
import { getWatched, isWatched, markWatched } from "@/lib/watched";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total > 0) setScrollProgress(window.scrollY / total);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [audioError, setAudioError] = useState(false);

  // Watched state
  const [watched, setWatched] = useState(false);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState<"notes" | "homework">("homework");

  // Notes state
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Homework answer state
  const [hwAnswer, setHwAnswer] = useState("");
  const [hwSaved, setHwSaved] = useState(false);
  const hwTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    (async () => {
      const all = await getLessons();
      const found = all.find((l) => l.id === String(params.id));
      if (!found || !isLessonUnlocked(found, session.startDate)) { router.replace("/dashboard"); return; }
      const [noteVal, hwVal, watchedAll] = await Promise.all([
        getNote(String(params.id), session.email),
        getNote(`hw_${String(params.id)}`, session.email),
        getWatched(session.email),
      ]);
      setStudent(session);
      setLesson(found);
      setLessons(all);
      setNote(noteVal);
      setHwAnswer(hwVal);
      setWatchedIds(watchedAll);
      setWatched(watchedAll.includes(found.id));
    })();
  }, [router, params.id]);

  // Auto-save notes with debounce
  const handleNoteChange = useCallback((value: string) => {
    setNote(value);
    setNoteSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (student && lesson) {
        await saveNote(lesson.id, student.email, value);
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
      }
    }, 800);
  }, [student, lesson]);

  const handleHwChange = useCallback((value: string) => {
    setHwAnswer(value);
    setHwSaved(false);
    if (hwTimer.current) clearTimeout(hwTimer.current);
    hwTimer.current = setTimeout(async () => {
      if (student && lesson) {
        await saveNote(`hw_${lesson.id}`, student.email, value);
        setHwSaved(true);
        setTimeout(() => setHwSaved(false), 2000);
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

  const cycleSpeed = () => {
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
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

  // Normalize title for sidebar — convert ALL CAPS to Sentence case
  function toSentenceCase(str: string) {
    if (str === str.toUpperCase()) {
      return str.charAt(0) + str.slice(1).toLowerCase();
    }
    return str;
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-3.5 sticky top-0 z-50 relative"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.07)",
          backgroundColor: "rgba(10,8,6,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Reading progress line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-none"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)",
            boxShadow: "0 0 8px rgba(201,168,76,0.5)",
          }}
        />
        <Link href="/dashboard">
          <motion.button
            className="flex items-center gap-2 text-sm"
            style={{ color: "#6a5a50" }}
            whileHover={{ color: "#a09080", x: -2 }}
            transition={{ duration: 0.15 }}
          >
            ← Назад до курсу
          </motion.button>
        </Link>
        <motion.span
          className="text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider"
          style={{ color: "#c9a84c", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          {lesson.block}
        </motion.span>
      </motion.header>

      {/* Body: sidebar + content */}
      <div className="flex min-h-0">

        {/* ── Sidebar (desktop only) ── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto"
          style={{ backgroundColor: "#09070604", borderRight: "1px solid rgba(201,168,76,0.07)" }}>
          {/* Sidebar header */}
          <div className="px-5 py-4 relative" style={{ borderBottom: "1px solid rgba(201,168,76,0.07)" }}>
            <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: "rgba(201,168,76,0.4)" }}>Зміст курсу</p>
            <p className="text-sm font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#c9a84c" }}>
              Стан Достатку
            </p>
            {/* Progress mini bar */}
            <div className="mt-3 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(201,168,76,0.08)" }}>
              <div className="h-full rounded-full" style={{
                width: `${lessons.length > 0 ? (watchedIds.length / lessons.length) * 100 : 0}%`,
                background: "linear-gradient(90deg, #c9a84c, #f0d080)",
              }} />
            </div>
            <p className="text-[10px] mt-1" style={{ color: "rgba(201,168,76,0.3)" }}>
              {watchedIds.length} / {lessons.length} переглянуто
            </p>
          </div>
          <nav className="py-1.5">
            {lessons.map((l, idx) => {
              const isUnlocked = isLessonUnlocked(l, student.startDate);
              const isWatchedLesson = watchedIds.includes(l.id);
              const isCurrent = l.id === lesson.id;
              return (
                <Link key={l.id} href={isUnlocked ? `/lesson/${l.id}` : "#"}>
                  <div
                    className="flex items-center gap-3 px-4 py-2.5 transition-all cursor-pointer group"
                    style={{
                      backgroundColor: isCurrent ? "rgba(201,168,76,0.07)" : "transparent",
                      borderLeft: `2px solid ${isCurrent ? "#c9a84c" : "transparent"}`,
                      opacity: isUnlocked ? 1 : 0.38,
                    }}
                  >
                    {/* Index */}
                    <span className="text-[10px] w-5 text-center flex-shrink-0 font-mono"
                      style={{ color: isCurrent ? "#c9a84c" : isWatchedLesson ? "rgba(201,168,76,0.4)" : "#2a2420" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: isCurrent ? "rgba(201,168,76,0.7)" : "#2a2420" }}>
                        {l.block}
                      </p>
                      <p className="text-xs leading-snug truncate" style={{
                        color: isCurrent ? "#f5f0e8" : isWatchedLesson ? "#7a6a50" : isUnlocked ? "#5a4a3a" : "#2a2420",
                        fontWeight: isCurrent ? 600 : 400,
                      }}>
                        {toSentenceCase(l.title)}
                      </p>
                    </div>
                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {!isUnlocked ? (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#221e1b" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="#c9a84c"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                      ) : isWatchedLesson ? (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ border: "1px solid #2a2420" }} />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

      {/* Video */}
      <motion.div
        className="w-full"
        style={{ backgroundColor: "#000" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* Lesson info + Audio + Notes */}
      <motion.div
        className="max-w-3xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Block tag */}
        <span className="inline-block text-[10px] uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-4"
          style={{ color: "#c9a84c", backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
          {lesson.block}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair)", lineHeight: 1.3 }}>
          {lesson.title}
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6a5a50" }}>{lesson.description}</p>

        {/* ── Mark as Watched ── */}
        <motion.button
          onClick={async () => {
            if (!watched && student && lesson) {
              await markWatched(lesson.id, student.email);
              setWatched(true);
              setWatchedIds(prev => [...prev, lesson.id]);
            }
          }}
          className="flex items-center gap-3 px-6 py-3.5 rounded-2xl mb-10 text-sm font-medium relative overflow-hidden"
          style={{
            backgroundColor: watched ? "rgba(201,168,76,0.1)" : "#161210",
            border: `1.5px solid ${watched ? "rgba(201,168,76,0.45)" : "#2a2420"}`,
            color: watched ? "#c9a84c" : "#5a4a40",
            cursor: watched ? "default" : "pointer",
            boxShadow: watched ? "0 4px 20px rgba(201,168,76,0.12)" : "none",
          }}
          whileHover={!watched ? {
            borderColor: "rgba(201,168,76,0.35)",
            color: "#a09070",
            boxShadow: "0 4px 20px rgba(201,168,76,0.07)",
          } : {}}
          whileTap={!watched ? { scale: 0.97 } : {}}
          animate={watched ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {watched && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.05), transparent)" }} />
          )}
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: watched ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${watched ? "rgba(201,168,76,0.4)" : "#2a2420"}`,
            }}
            animate={watched ? { rotate: [0, 360] } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {watched ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a4a40" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/>
              </svg>
            )}
          </motion.div>
          {watched ? "Урок переглянуто ✓" : "Позначити як переглянутий"}
        </motion.button>

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

              {/* Speed */}
              <button
                onClick={cycleSpeed}
                className="hidden sm:flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all"
                style={{
                  backgroundColor: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: "#c9a84c",
                  minWidth: "2.5rem",
                }}
                title="Швидкість відтворення"
              >
                <motion.span key={speed} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                  {speed}x
                </motion.span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Tabs: Завдання / Нотатки ── */}
        <motion.div
          className="rounded-2xl overflow-hidden mb-10"
          style={{ border: "1px solid rgba(201,168,76,0.1)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {/* Tab bar */}
          <div className="flex" style={{ backgroundColor: "#121008", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
            {([
              { id: "homework", label: "Завдання", icon: "✦" },
              { id: "notes",    label: "Нотатки",  icon: "✍" },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-[0.15em] transition-all relative"
                style={{
                  color: activeTab === tab.id ? "#c9a84c" : "#4a3a30",
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  backgroundColor: activeTab === tab.id ? "rgba(201,168,76,0.05)" : "transparent",
                }}
              >
                <span style={{ fontSize: "10px" }}>{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }}
                  />
                )}
              </button>
            ))}
            {/* Save indicator */}
            <div className="ml-auto flex items-center px-4">
              <motion.span
                className="text-xs"
                style={{ color: "#6a5a40" }}
                animate={{ opacity: (activeTab === "notes" ? noteSaved : hwSaved) ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                збережено ✓
              </motion.span>
            </div>
          </div>

          {/* Tab: Завдання */}
          {activeTab === "homework" && (
            <div style={{ backgroundColor: "#13110e" }}>
              {/* Task description */}
              {lesson.homework ? (
                <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1a16" }}>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#c9a84c" }}>
                    Завдання до уроку
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#c9b8a8" }}>
                    {lesson.homework}
                  </p>
                </div>
              ) : (
                <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #1e1a16" }}>
                  <p className="text-sm" style={{ color: "#3a2a20" }}>Завдання ще не додано.</p>
                </div>
              )}
              {/* Answer textarea */}
              <div>
                <p className="px-5 pt-4 text-xs uppercase tracking-widest" style={{ color: "#4a3a30" }}>
                  Моя відповідь
                </p>
                <textarea
                  value={hwAnswer}
                  onChange={(e) => handleHwChange(e.target.value)}
                  placeholder="Запишіть свою відповідь тут…&#10;&#10;Зберігається автоматично."
                  rows={6}
                  className="w-full px-5 py-3 text-sm leading-relaxed outline-none resize-none"
                  style={{
                    backgroundColor: "transparent",
                    color: "#d4c9b8",
                    caretColor: "#c9a84c",
                    fontFamily: "inherit",
                  }}
                />
                <div className="px-5 pb-3 flex justify-end">
                  <span className="text-xs" style={{ color: "#2a2420" }}>
                    {hwAnswer.length > 0 ? `${hwAnswer.length} симв.` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Нотатки */}
          {activeTab === "notes" && (
            <div style={{ backgroundColor: "#13110e" }}>
              {/* Privacy notice */}
              <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a3a30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-xs" style={{ color: "#4a3a30" }}>
                  Нотатки бачите тільки ви — вони приватні
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Записуйте думки, інсайти, практики з цього уроку…&#10;&#10;Нотатки зберігаються автоматично."
                rows={10}
                className="w-full px-5 py-3 text-sm leading-relaxed outline-none resize-none"
                style={{
                  backgroundColor: "transparent",
                  color: "#d4c9b8",
                  caretColor: "#c9a84c",
                  fontFamily: "inherit",
                }}
              />
              <div className="px-5 pb-3 flex justify-end">
                <span className="text-xs" style={{ color: "#2a2420" }}>
                  {note.length > 0 ? `${note.length} симв.` : ""}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            {prevLesson && (
              <Link href={`/lesson/${prevLesson.id}`}>
                <motion.button
                  className="flex items-center gap-2 text-sm px-5 py-3.5 rounded-2xl w-full"
                  style={{
                    backgroundColor: "#110f0c",
                    border: "1px solid #1e1a16",
                    color: "#7a6a60",
                  }}
                  whileHover={{ borderColor: "rgba(201,168,76,0.2)", color: "#a09080", x: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  <span className="truncate text-left">{toSentenceCase(prevLesson.title)}</span>
                </motion.button>
              </Link>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            {nextLesson && (
              nextUnlocked ? (
                <Link href={`/lesson/${nextLesson.id}`} className="w-full">
                  <motion.button
                    className="btn-gold text-sm px-5 py-3.5 w-full flex items-center justify-end gap-2"
                    whileHover={{ scale: 1.02, x: 2 }} whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="truncate">{toSentenceCase(nextLesson.title)}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </motion.button>
                </Link>
              ) : (
                <div className="text-sm px-5 py-3.5 rounded-2xl flex items-center gap-2 w-full justify-end"
                  style={{ backgroundColor: "#110f0c", border: "1px solid #1e1a16", color: "#3a2a20" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a2a20" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Відкриється пізніше
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>
        </div> {/* end main content */}
      </div> {/* end body flex */}
    </main>
  );
}
