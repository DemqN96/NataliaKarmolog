"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession, hasCertificateAccess, updateStudent, type Student } from "@/lib/auth";
import { getLessons, getUnlockedDays } from "@/lib/lessons";
import { getWatched } from "@/lib/watched";
import { getNoteCount } from "@/lib/notes";

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
  const [certAccess, setCertAccess] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ newPassword: "", confirmPassword: "", birthday: "" });
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.replace("/login"); return; }
    const days = getUnlockedDays(session.startDate);
    setStudent(session);
    setSettingsForm({ newPassword: "", confirmPassword: "", birthday: session.birthday ?? "" });

    (async () => {
      const [lessons, watched, noteCount, certAccess] = await Promise.all([
        getLessons(),
        getWatched(session.email),
        getNoteCount(session.email),
        hasCertificateAccess(session.email),
      ]);

      setCertAccess(certAccess);
      setStats({ lessons: lessons.length, watched: watched.length, notes: noteCount, days: Math.max(0, days) });

      const pct = lessons.length > 0 ? (watched.length / lessons.length) * 100 : 0;
      setBadges([
        { id: "first",    icon: "🌱",  title: "Перший крок",      desc: "Переглянути перший урок",      unlocked: watched.length >= 1 },
        { id: "halfway",  icon: "⚡",  title: "Середина шляху",   desc: "Переглянути 50% курсу",        unlocked: pct >= 50 },
        { id: "notes",    icon: "✍️", title: "Нотатник",          desc: "Зробити нотатки до 3 уроків",  unlocked: noteCount >= 3 },
        { id: "streak",   icon: "🔥",  title: "Регулярність",     desc: "7 днів у курсі",               unlocked: days >= 7 },
        { id: "complete", icon: "👑",  title: "Майстер достатку", desc: "Завершити весь курс",           unlocked: pct >= 100 },
      ]);
    })();
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
    <main className="min-h-screen" style={{ backgroundColor: "#0a0806", color: "#f5f0e8" }}>

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-3.5 sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(201,168,76,0.07)",
          backgroundColor: "rgba(10,8,6,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/dashboard">
          <motion.button
            className="flex items-center gap-2 text-sm"
            style={{ color: "#5a4a40" }}
            whileHover={{ color: "#a09080", x: -2 }}
            transition={{ duration: 0.15 }}
          >
            ← До курсу
          </motion.button>
        </Link>
        <h1 className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          Мій <span className="text-gold-gradient">профіль</span>
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
              className="rounded-2xl p-4 relative overflow-hidden card-hover"
              style={{ backgroundColor: "#121008", border: "1px solid rgba(201,168,76,0.08)" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at 100% 0%, rgba(201,168,76,0.05), transparent 70%)" }} />
              <p className="text-[11px] mb-2" style={{ color: "#4a3a30" }}>{s.icon} {s.label}</p>
              <p className="text-2xl font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
                {s.value}
                {"total" in s && <span className="text-sm font-normal" style={{ color: "#2a2420" }}> /{s.total}</span>}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certificate block */}
        <motion.div
          className="rounded-3xl p-6 mb-8 relative overflow-hidden"
          style={{
            backgroundColor: certAccess ? "#1e1a0e" : "#1a1612",
            border: `1px solid ${certAccess ? "rgba(201,168,76,0.45)" : "#2a2420"}`,
            boxShadow: certAccess ? "0 0 50px rgba(201,168,76,0.1)" : "none",
          }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {certAccess && (
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)" }} />
          )}
          <div className="relative flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                backgroundColor: certAccess ? "rgba(201,168,76,0.15)" : "#13110e",
                border: `1.5px solid ${certAccess ? "rgba(201,168,76,0.4)" : "#2a2420"}`,
              }}
            >
              👑
            </div>
            <div className="flex-1">
              <p className="font-bold text-base mb-0.5" style={{ fontFamily: "var(--font-playfair)", color: certAccess ? "#f5f0e8" : "#4a3a30" }}>
                Сертифікат про завершення
              </p>
              <p className="text-xs" style={{ color: certAccess ? "#7a6a60" : "#2a2420" }}>
                {certAccess ? "Доступний! Натисніть щоб отримати." : "Видається після завершення курсу."}
              </p>
            </div>
            {certAccess ? (
              <Link href="/complete">
                <motion.button
                  className="btn-gold px-5 py-3 text-sm flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: ["0 4px 20px rgba(201,168,76,0.3)", "0 4px 35px rgba(201,168,76,0.6)", "0 4px 20px rgba(201,168,76,0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  Отримати →
                </motion.button>
              </Link>
            ) : (
              <div className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm"
                style={{ backgroundColor: "#13110e", border: "1px solid #2a2420", color: "#2a2420" }}>
                🔒
              </div>
            )}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Досягнення
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", color: "#c9a84c" }}>
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {badges.map((b, i) => (
              <motion.div
                key={b.id}
                className="flex items-center gap-4 rounded-2xl p-5"
                style={{
                  backgroundColor: b.unlocked ? "rgba(201,168,76,0.07)" : "#1a1612",
                  border: `1px solid ${b.unlocked ? "rgba(201,168,76,0.3)" : "#1e1a16"}`,
                  opacity: b.unlocked ? 1 : 0.4,
                }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: b.unlocked ? 1 : 0.4, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    backgroundColor: b.unlocked ? "rgba(201,168,76,0.15)" : "#13110e",
                    border: `1.5px solid ${b.unlocked ? "rgba(201,168,76,0.4)" : "#2a2420"}`,
                  }}
                >
                  {b.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-0.5" style={{ color: b.unlocked ? "#f5f0e8" : "#3a2a20" }}>
                    {b.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: b.unlocked ? "#7a6a60" : "#2a2420" }}>
                    {b.desc}
                  </p>
                </div>
                {b.unlocked ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#13110e", border: "1px solid #2a2420" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2a2420" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* ── Settings ── */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
            Налаштування
          </h3>

          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2a2420" }}>
            {/* Header */}
            <div className="px-6 py-4" style={{ backgroundColor: "#1a1612", borderBottom: "1px solid #2a2420" }}>
              <p className="text-xs uppercase tracking-widest" style={{ color: "#c9a84c" }}>Особисті дані</p>
            </div>

            <div className="px-6 py-5 space-y-4" style={{ backgroundColor: "#13110e" }}>

              {/* New password */}
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#6a5a50" }}>
                  Новий пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassNew ? "text" : "password"}
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm(f => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Залиште порожнім, щоб не змінювати"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-12"
                    style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#f5f0e8", caretColor: "#c9a84c" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded transition-opacity hover:opacity-70"
                    style={{ color: "#6a5a50" }}
                  >
                    {showPassNew ? "Сховати" : "Показати"}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#6a5a50" }}>
                  Підтвердження паролю
                </label>
                <div className="relative">
                  <input
                    type={showPassConfirm ? "text" : "password"}
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="Повторіть новий пароль"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-12"
                    style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#f5f0e8", caretColor: "#c9a84c" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded transition-opacity hover:opacity-70"
                    style={{ color: "#6a5a50" }}
                  >
                    {showPassConfirm ? "Сховати" : "Показати"}
                  </button>
                </div>
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: "#6a5a50" }}>
                  Дата народження
                </label>
                <input
                  type="date"
                  value={settingsForm.birthday}
                  onChange={(e) => setSettingsForm(f => ({ ...f, birthday: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", color: "#f5f0e8", colorScheme: "dark", caretColor: "#c9a84c" }}
                />
              </div>

              {/* Save button + message */}
              {settingsMsg && (
                <p className="text-sm" style={{ color: settingsMsg.ok ? "#c9a84c" : "#ff6b6b" }}>
                  {settingsMsg.text}
                </p>
              )}

              <button
                onClick={async () => {
                  if (!student) return;
                  const updates: Parameters<typeof updateStudent>[1] = {};

                  if (settingsForm.newPassword.trim()) {
                    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
                      setSettingsMsg({ text: "Паролі не співпадають", ok: false });
                      return;
                    }
                    updates.password = settingsForm.newPassword.trim();
                  }

                  if (settingsForm.birthday !== (student.birthday ?? ""))
                    updates.birthday = settingsForm.birthday;

                  if (Object.keys(updates).length === 0) {
                    setSettingsMsg({ text: "Нічого не змінено", ok: false });
                    return;
                  }
                  const res = await updateStudent(student.email, updates);
                  if (res.ok && res.student) {
                    setStudent(res.student);
                    setSettingsForm(f => ({ ...f, newPassword: "", confirmPassword: "" }));
                    setSettingsMsg({ text: "Збережено ✓", ok: true });
                    setTimeout(() => setSettingsMsg(null), 3000);
                  } else {
                    setSettingsMsg({ text: res.error ?? "Помилка", ok: false });
                  }
                }}
                className="btn-gold w-full py-3 text-sm"
              >
                Зберегти зміни
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
