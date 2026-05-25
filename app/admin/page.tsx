"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  addStudent, getStudents, saveStudents, ADMIN_PASSWORD, type Student,
} from "@/lib/auth";
import { getWatchedCount } from "@/lib/watched";
import {
  getLessons, saveLessons, addLesson, updateLesson, deleteLesson,
  moveLessonUp, moveLessonDown, type Lesson,
} from "@/lib/lessons";

const EMPTY_LESSON = { title: "", block: "", description: "", youtubeId: "", duration: "", day: 0, audioUrl: "" };

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<"lessons" | "students">("lessons");

  // --- Lessons state ---
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Lesson, "id">>(EMPTY_LESSON);
  const [addForm, setAddForm] = useState<Omit<Lesson, "id">>(EMPTY_LESSON);
  const [showAddForm, setShowAddForm] = useState(false);
  const [lessonMsg, setLessonMsg] = useState("");

  // --- Students state ---
  const [students, setStudents] = useState<Student[]>([]);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "", startDate: "" });
  const [studentMsg, setStudentMsg] = useState("");

  useEffect(() => {
    if (auth) {
      setLessons(getLessons());
      setStudents(getStudents());
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
  function refreshLessons() { setLessons(getLessons()); }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    const { id, ...rest } = lesson;
    setEditForm(rest);
  }

  function saveEdit() {
    if (!editingId) return;
    updateLesson(editingId, { ...editForm, day: Number(editForm.day) });
    setEditingId(null);
    refreshLessons();
    flash(setLessonMsg, "Урок оновлено ✓");
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addLesson({ ...addForm, day: Number(addForm.day) });
    setAddForm(EMPTY_LESSON);
    setShowAddForm(false);
    refreshLessons();
    flash(setLessonMsg, "Урок додано ✓");
  }

  function handleDelete(id: string) {
    if (!confirm("Видалити урок?")) return;
    deleteLesson(id);
    refreshLessons();
  }

  function handleMoveUp(id: string) { moveLessonUp(id); refreshLessons(); }
  function handleMoveDown(id: string) { moveLessonDown(id); refreshLessons(); }

  // ── Student helpers ──
  function handleAddStudent(e: React.FormEvent) {
    e.preventDefault();
    addStudent({ ...studentForm });
    setStudents(getStudents());
    setStudentForm({ name: "", email: "", password: "", startDate: "" });
    flash(setStudentMsg, `Студента ${studentForm.name} додано ✓`);
  }

  function handleDeleteStudent(email: string) {
    const updated = students.filter((s) => s.email !== email);
    saveStudents(updated);
    setStudents(updated);
  }

  function handleResetStartDate(email: string) {
    const today = new Date().toISOString().slice(0, 10);
    const updated = students.map((s) =>
      s.email === email ? { ...s, startDate: today } : s
    );
    saveStudents(updated);
    setStudents(updated);
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
        <div className="flex gap-2 mb-6">
          {(["lessons", "students"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: tab === t ? "#c9a84c" : "#1a1612",
                color: tab === t ? "#0f0d0a" : "#a09080",
                border: "1px solid " + (tab === t ? "#c9a84c" : "#2a2420"),
              }}
            >
              {t === "lessons" ? `📹 Уроки (${lessons.length})` : `👥 Студенти (${students.length})`}
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
                        {["Ім'я", "Email", "Старт", "Прогрес", "Дії"].map((h) => (
                          <th key={h} className="px-4 py-2.5 text-left text-xs uppercase tracking-wider"
                            style={{ color: "#6a5a50" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => {
                        const watchedCnt = getWatchedCount(s.email);
                        const pct = lessons.length > 0 ? Math.round((watchedCnt / lessons.length) * 100) : 0;
                        return (
                          <tr key={s.email}
                            style={{ borderBottom: i < students.length - 1 ? "1px solid #1e1a16" : "none" }}>
                            <td className="px-4 py-3 font-medium">{s.name}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a6a60" }}>{s.email}</td>
                            <td className="px-4 py-3 text-xs" style={{ color: "#7a6a60" }}>{s.startDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#2a2420" }}>
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#c9a84c" }} />
                                </div>
                                <span className="text-xs" style={{ color: "#c9a84c" }}>{watchedCnt}/{lessons.length}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
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
  const fields = [
    { key: "title", label: "Назва уроку", type: "text", placeholder: "Фінансова карма" },
    { key: "block", label: "Блок", type: "text", placeholder: "БЛОК 1" },
    { key: "youtubeId", label: "YouTube ID", type: "text", placeholder: "dQw4w9WgXcQ" },
    { key: "day", label: "Відкривається на день №", type: "number", placeholder: "0" },
    { key: "duration", label: "Тривалість", type: "text", placeholder: "~30 хв" },
    { key: "description", label: "Опис", type: "text", placeholder: "Короткий опис уроку..." },
    { key: "audioUrl", label: "Аудіо (пряме посилання на mp3/m4a)", type: "url", placeholder: "https://..." },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {fields.map((f) => (
        <div key={f.key} className={(f.key === "description" || f.key === "audioUrl") ? "md:col-span-2" : ""}>
          <label className="block text-xs mb-1" style={{ color: "#a09080" }}>{f.label}</label>
          <input
            type={f.type}
            value={String(form[f.key as keyof typeof form])}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            min={f.type === "number" ? 0 : undefined}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8" }}
          />
        </div>
      ))}
    </div>
  );
}
