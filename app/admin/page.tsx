"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  addStudent, getStudents, deleteStudent, resetStartDate,
  toggleCertificate, ADMIN_PASSWORD, type Student,
} from "@/lib/auth";
import { getWatchedCount } from "@/lib/watched";
import {
  getLessons, addLesson, updateLesson, deleteLesson,
  moveLessonUp, moveLessonDown, type Lesson,
} from "@/lib/lessons";

const EMPTY_LESSON = { title: "", block: "", description: "", youtubeId: "", duration: "", day: 0, audioUrl: "", audioUrl2: "", homework: "" };

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"lessons" | "students" | "security">("lessons");

  // --- Lessons state ---
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Lesson, "id">>(EMPTY_LESSON);
  const [addForm, setAddForm] = useState<Omit<Lesson, "id">>(EMPTY_LESSON);
  const [showAddForm, setShowAddForm] = useState(false);
  const [lessonMsg, setLessonMsg] = useState("");

  // --- Students state ---
  const [students, setStudents] = useState<Student[]>([]);
  const [watchedCounts, setWatchedCounts] = useState<Record<string, number>>({});
  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "", startDate: "" });
  const [studentMsg, setStudentMsg] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  function togglePassVisible(email: string) {
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  useEffect(() => {
    if (auth) {
      (async () => {
        const [l, s] = await Promise.all([getLessons(), getStudents()]);
        setLessons(l);
        setStudents(s);
        // Load watched counts for all students
        const counts: Record<string, number> = {};
        await Promise.all(s.map(async (st) => {
          counts[st.email] = await getWatchedCount(st.email);
        }));
        setWatchedCounts(counts);
      })();
    }
  }, [auth]);

  function flash(setter: (v: string) => void, msg: string) {
    setter(msg);
    setTimeout(() => setter(""), 3000);
  }

  // ── Auth ──
  if (!auth) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0f0d0a" }}>
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-8" style={{ color: "#f5f0e8" }}>Адмін панель</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adminPass === ADMIN_PASSWORD ? setAuth(true) : setAuthError("Невірний пароль");
            }}
            className="rounded-2xl p-8 space-y-4"
            style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
          >
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Пароль адміністратора"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8" }}
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button type="submit" className="btn-gold w-full">Увійти</button>
          </form>
        </div>
      </main>
    );
  }

  // ── Lesson helpers ──
  async function refreshLessons() { setLessons(await getLessons()); }
  async function refreshStudents() {
    const s = await getStudents();
    setStudents(s);
    const counts: Record<string, number> = {};
    await Promise.all(s.map(async (st) => { counts[st.email] = await getWatchedCount(st.email); }));
    setWatchedCounts(counts);
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    const { id, ...rest } = lesson;
    setEditForm(rest);
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateLesson(editingId, { ...editForm, day: Number(editForm.day) });
    setEditingId(null);
    await refreshLessons();
    flash(setLessonMsg, "Урок оновлено ✓");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await addLesson({ ...addForm, day: Number(addForm.day) });
    setAddForm(EMPTY_LESSON);
    setShowAddForm(false);
    await refreshLessons();
    flash(setLessonMsg, "Урок додано ✓");
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити урок?")) return;
    await deleteLesson(id);
    await refreshLessons();
  }

  async function handleMoveUp(id: string) { await moveLessonUp(id); await refreshLessons(); }
  async function handleMoveDown(id: string) { await moveLessonDown(id); await refreshLessons(); }

  // ── Student helpers ──
  async function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    await addStudent({ ...studentForm });
    await refreshStudents();
    setStudentForm({ name: "", email: "", password: "", startDate: "" });
    flash(setStudentMsg, `Студента ${studentForm.name} додано ✓`);
  }

  async function handleDeleteStudent(email: string) {
    await deleteStudent(email);
    await refreshStudents();
  }

  async function handleToggleCertificate(email: string) {
    const s = students.find((st) => st.email === email);
    await toggleCertificate(email, !s?.certificateUnlocked);
    await refreshStudents();
  }

  async function handleResetStartDate(email: string) {
    const today = new Date().toISOString().slice(0, 10);
    await resetStartDate(email, today);
    await refreshStudents();
    flash(setStudentMsg, `Дату старту скинуто на сьогодні (${today})`);
  }

  return (
    <main className="min-h-screen px-4 py-8" style={{ backgroundColor: "#0f0d0a", color: "#f5f0e8" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Адмін <span style={{ color: "#c9a84c" }}>панель</span>
          </h1>
          <Link href="/">
            <button className="text-sm px-4 py-2 rounded-lg" style={{ color: "#a09080", border: "1px solid #2a2420" }}>
              ← На сайт
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: "lessons", label: `📹 Уроки (${lessons.length})` },
            { key: "students", label: `👥 Студенти (${students.length})` },
            { key: "security", label: "🔐 Безпека" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t.key ? "#c9a84c" : "#1a1612",
                color: tab === t.key ? "#0f0d0a" : "#a09080",
                border: "1px solid " + (tab === t.key ? "#c9a84c" : "#2a2420"),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════ LESSONS TAB ════════════ */}
        {tab === "lessons" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#c9a84c" }}>Управління уроками</h2>
              <button
                onClick={() => setShowAddForm((v) => !v)}
                className="text-sm px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: showAddForm ? "#2a2420" : "#c9a84c", color: showAddForm ? "#a09080" : "#0f0d0a", border: "1px solid #c9a84c" }}
              >
                {showAddForm ? "✕ Скасувати" : "+ Додати урок"}
              </button>
            </div>

            {lessonMsg && (
              <p className="text-center text-sm mb-4" style={{ color: "#c9a84c" }}>{lessonMsg}</p>
            )}

            {/* Add form */}
            {showAddForm && (
              <form
                onSubmit={handleAdd}
                className="rounded-xl p-5 mb-6 space-y-3"
                style={{ backgroundColor: "#1a1612", border: "1px solid #c9a84c" }}
              >
                <h3 className="font-bold text-sm mb-3" style={{ color: "#c9a84c" }}>Новий урок</h3>
                <LessonFormFields form={addForm} setForm={setAddForm} />
                <button type="submit" className="btn-gold w-full mt-2">Додати урок</button>
              </form>
            )}

            {/* Lessons list */}
            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: "#1a1612", border: `1px solid ${editingId === lesson.id ? "#c9a84c" : "#2a2420"}` }}
                >
                  {/* Row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleMoveUp(lesson.id)}
                        disabled={idx === 0}
                        className="text-xs w-6 h-6 rounded flex items-center justify-center disabled:opacity-20"
                        style={{ backgroundColor: "#2a2420", color: "#c9a84c" }}
                        title="Перемістити вгору"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMoveDown(lesson.id)}
                        disabled={idx === lessons.length - 1}
                        className="text-xs w-6 h-6 rounded flex items-center justify-center disabled:opacity-20"
                        style={{ backgroundColor: "#2a2420", color: "#c9a84c" }}
                        title="Перемістити вниз"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Number */}
                    <span
                      className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#2a2420", color: "#c9a84c" }}
                    >
                      {idx + 1}
                    </span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs mb-0.5" style={{ color: "#c9a84c" }}>{lesson.block} · День {lesson.day}</p>
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      <p className="text-xs truncate" style={{ color: "#6a5a50" }}>
                        youtube.com/watch?v={lesson.youtubeId}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => editingId === lesson.id ? setEditingId(null) : startEdit(lesson)}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: editingId === lesson.id ? "#2a2420" : "#1e1a10",
                          border: "1px solid #c9a84c",
                          color: "#c9a84c",
                        }}
                      >
                        {editingId === lesson.id ? "Скасувати" : "✏️ Редагувати"}
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: "#1e1010", border: "1px solid #5a2020", color: "#ff6b6b" }}
                      >
                        🗑 Видалити
                      </button>
                    </div>
                  </div>

                  {/* Edit form */}
                  {editingId === lesson.id && (
                    <div className="px-4 pb-4 pt-1" style={{ borderTop: "1px solid #2a2420" }}>
                      <LessonFormFields form={editForm} setForm={setEditForm} />
                      <button onClick={saveEdit} className="btn-gold w-full mt-3 text-sm py-2.5">
                        Зберегти зміни
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {lessons.length === 0 && (
                <p className="text-center py-8 text-sm" style={{ color: "#a09080" }}>
                  Уроків ще немає. Додайте перший!
                </p>
              )}
            </div>
          </div>
        )}

        {/* ════════════ STUDENTS TAB ════════════ */}
        {tab === "students" && (
          <div>
            {/* Add student form */}
            <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#c9a84c" }}>Додати студента</h2>
              <form onSubmit={handleAddStudent} className="grid md:grid-cols-2 gap-3">
                {[
                  { key: "name", label: "Ім'я", type: "text", placeholder: "Наталія" },
                  { key: "email", label: "Email", type: "email", placeholder: "student@email.com" },
                  { key: "password", label: "Пароль", type: "text", placeholder: "пароль для студента" },
                  { key: "startDate", label: "Дата початку", type: "date", placeholder: "" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs mb-1" style={{ color: "#d4c9b8" }}>{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={studentForm[field.key as keyof typeof studentForm]}
                      onChange={(e) => setStudentForm({ ...studentForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                      style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8", colorScheme: "dark" }}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <button type="submit" className="btn-gold w-full">Додати студента</button>
                </div>
              </form>
              {studentMsg && <p className="text-center mt-2 text-sm" style={{ color: "#c9a84c" }}>{studentMsg}</p>}
            </div>

            {/* Students list */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #2a2420" }}>
                <h2 className="text-lg font-bold" style={{ color: "#c9a84c" }}>
                  Студенти ({students.length})
                </h2>
              </div>
              {students.length === 0 ? (
                <p className="text-sm px-5 py-6" style={{ color: "#a09080" }}>Ще немає студентів.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #2a2420" }}>
                        {["Ім'я", "Email", "Пароль", "Старт", "ДН", "Прогрес", "Дії"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider"
                            style={{ color: "#6a5a50" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const watchedCnt = watchedCounts[s.email] ?? 0;
                        const pct = lessons.length > 0 ? Math.round((watchedCnt / lessons.length) * 100) : 0;
                        const passVisible = visiblePasswords.has(s.email);
                        return (
                          <tr key={s.email}
                            style={{ borderBottom: i < students.length - 1 ? "1px solid #1e1a16" : "none" }}>
                            <td className="px-4 py-3 font-medium">{s.name}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a6a60" }}>{s.email}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono"
                                  style={{ color: passVisible ? "#f5f0e8" : "#3a2a20", letterSpacing: passVisible ? "normal" : "0.15em" }}>
                                  {passVisible ? s.password : "••••••"}
                                </span>
                                <button
                                  onClick={() => togglePassVisible(s.email)}
                                  className="text-[10px] px-1.5 py-0.5 rounded transition-opacity hover:opacity-70"
                                  style={{ color: "#6a5a50", border: "1px solid #2a2420" }}
                                >
                                  {passVisible ? "сх" : "пк"}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a6a60" }}>{s.startDate}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a6a60" }}>
                              {s.birthday ?? <span style={{ color: "#2a2420" }}>—</span>}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2420" }}>
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#c9a84c" }} />
                                </div>
                                <span className="text-xs" style={{ color: "#c9a84c" }}>{watchedCnt}/{lessons.length}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => handleToggleCertificate(s.email)}
                                  className="text-xs px-2.5 py-1 rounded font-medium transition-all"
                                  style={{
                                    color: s.certificateUnlocked ? "#0f0d0a" : "#c9a84c",
                                    border: `1px solid ${s.certificateUnlocked ? "#c9a84c" : "rgba(201,168,76,0.3)"}`,
                                    backgroundColor: s.certificateUnlocked ? "#c9a84c" : "rgba(201,168,76,0.05)",
                                  }}
                                  title={s.certificateUnlocked ? "Забрати сертифікат" : "Видати сертифікат"}
                                >
                                  {s.certificateUnlocked ? "👑 Є" : "👑 Дати"}
                                </button>
                                <button
                                  onClick={() => handleResetStartDate(s.email)}
                                  className="text-xs px-2.5 py-1 rounded"
                                  style={{ color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0.05)" }}
                                  title="Скинути дату старту на сьогодні"
                                >
                                  ↺ Старт
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(s.email)}
                                  className="text-xs px-2.5 py-1 rounded"
                                  style={{ color: "#ff6b6b", border: "1px solid #3a2020" }}
                                >
                                  Видалити
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ════════════ SECURITY TAB ════════════ */}
        {tab === "security" && (
          <div className="max-w-xl space-y-5">

            {/* Current password */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2a2420" }}>
              <div className="px-6 py-4" style={{ backgroundColor: "#1a1612", borderBottom: "1px solid #2a2420" }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#c9a84c" }}>Поточний пароль адміна</p>
              </div>
              <div className="px-6 py-5" style={{ backgroundColor: "#13110e" }}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}>
                  <span className="text-xs font-mono flex-1" style={{ color: "#a09080", letterSpacing: "0.15em" }}>
                    {"•".repeat(Math.max(8, ADMIN_PASSWORD.length))}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(201,168,76,0.1)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }}>
                    .env.local
                  </span>
                </div>
              </div>
            </div>

            {/* How to change */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2a2420" }}>
              <div className="px-6 py-4" style={{ backgroundColor: "#1a1612", borderBottom: "1px solid #2a2420" }}>
                <p className="text-xs uppercase tracking-widest" style={{ color: "#c9a84c" }}>Як змінити пароль</p>
              </div>
              <div className="px-6 py-5 space-y-4" style={{ backgroundColor: "#13110e" }}>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>1</span>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#d4c9b8" }}>Відкрийте файл <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: "#1a1612", color: "#c9a84c", border: "1px solid #2a2420" }}>.env.local</code> у корені проєкту</p>
                    <p className="text-xs" style={{ color: "#4a3a30" }}>Знаходиться поряд з <code style={{ color: "#6a5a50" }}>package.json</code></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>2</span>
                  <div className="flex-1">
                    <p className="text-sm mb-2" style={{ color: "#d4c9b8" }}>Змініть значення змінної на новий пароль</p>
                    <div className="rounded-xl px-4 py-3 font-mono text-xs" style={{ backgroundColor: "#0f0d0a", border: "1px solid #2a2420", color: "#a09080" }}>
                      <span style={{ color: "#6a8a60" }}>NEXT_PUBLIC_ADMIN_PASSWORD</span>
                      <span style={{ color: "#5a4a40" }}>=</span>
                      <span style={{ color: "#c9a84c" }}>ВашНовийПароль</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}>3</span>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "#d4c9b8" }}>Перезапустіть сервер</p>
                    <div className="rounded-xl px-4 py-2.5 font-mono text-xs" style={{ backgroundColor: "#0f0d0a", border: "1px solid #2a2420", color: "#c9a84c" }}>
                      npm run dev
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="rounded-xl px-4 py-3 flex items-start gap-3 mt-2"
                  style={{ backgroundColor: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)" }}>
                  <span style={{ color: "#c9a84c", fontSize: "14px" }}>⚠</span>
                  <p className="text-xs leading-relaxed" style={{ color: "#7a6a50" }}>
                    Файл <code style={{ color: "#c9a84c" }}>.env.local</code> не потрапляє в git і не публікується.
                    Пароль зберігається лише на вашому сервері — стороннього доступу немає.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}

// ── Shared form fields component ──
function LessonFormFields({
  form,
  setForm,
}: {
  form: Omit<Lesson, "id">;
  setForm: (f: Omit<Lesson, "id">) => void;
}) {
  const fields: { key: string; label: string; type: string; placeholder: string }[] = [
    { key: "title", label: "Назва уроку", type: "text", placeholder: "Фінансова карма" },
    { key: "block", label: "Блок", type: "text", placeholder: "БЛОК 1" },
    { key: "youtubeId", label: "YouTube ID", type: "text", placeholder: "dQw4w9WgXcQ" },
    { key: "day", label: "Відкривається на день №", type: "number", placeholder: "0" },
    { key: "duration", label: "Тривалість", type: "text", placeholder: "40–60 хв" },
    { key: "description", label: "Опис", type: "text", placeholder: "Короткий опис уроку..." },
    { key: "audioUrl", label: "Аудіо 1 (посилання на mp3 або /api/audio?id=...)", type: "url", placeholder: "/api/audio?id=..." },
    { key: "audioUrl2", label: "Аудіо 2 (необов'язково)", type: "url", placeholder: "/api/audio?id=..." },
    { key: "homework", label: "Завдання до уроку", type: "textarea", placeholder: "Напишіть завдання для учасників курсу…" },
  ];

  const fullWidthKeys = ["description", "audioUrl", "audioUrl2", "homework"];

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {fields.map((f) => (
        <div key={f.key} className={fullWidthKeys.includes(f.key) ? "md:col-span-2" : ""}>
          <label className="block text-xs mb-1" style={{ color: "#a09080" }}>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={String(form[f.key as keyof typeof form] ?? "")}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-y"
              style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8", fontFamily: "inherit" }}
            />
          ) : (
            <input
              type={f.type}
              value={String(form[f.key as keyof typeof form] ?? "")}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              min={f.type === "number" ? 0 : undefined}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
