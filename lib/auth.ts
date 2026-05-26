export interface Student {
  email: string;
  name: string;
  startDate: string;
  password: string;
  certificateUnlocked?: boolean;
  birthday?: string;
}

const SESSION_KEY = "sd_session";

// ── Session (localStorage cache) ──────────────────────────────
export function getSession(): Student | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(student: Student): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(student));
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Auth API calls ─────────────────────────────────────────────
export async function login(email: string, password: string): Promise<Student | null> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  const data = await res.json();
  if (!data.ok) return null;
  setSession(data.student);
  return data.student as Student;
}

export async function updateStudent(
  currentEmail: string,
  updates: Partial<Pick<Student, "email" | "password" | "birthday">>
): Promise<{ ok: boolean; error?: string; student?: Student }> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", currentEmail, updates }),
  });
  const data = await res.json();
  if (data.ok && data.student) setSession(data.student);
  return data;
}

// ── Students CRUD (admin) ──────────────────────────────────────
export async function getStudents(): Promise<Student[]> {
  const res = await fetch("/api/students");
  return res.json();
}

export async function addStudent(student: Student): Promise<void> {
  await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: student.email,
      name: student.name,
      password: student.password,
      startDate: student.startDate,
    }),
  });
}

export async function deleteStudent(email: string): Promise<void> {
  await fetch(`/api/students?email=${encodeURIComponent(email)}`, { method: "DELETE" });
}

export async function resetStartDate(email: string, date: string): Promise<void> {
  await fetch("/api/students", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, startDate: date }),
  });
}

export async function toggleCertificate(email: string, value: boolean): Promise<void> {
  await fetch("/api/students", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, certificateUnlocked: value }),
  });
}

export async function hasCertificateAccess(email: string): Promise<boolean> {
  const students = await getStudents();
  const s = students.find((st) => st.email === email);
  return !!s?.certificateUnlocked;
}

export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin2024";
