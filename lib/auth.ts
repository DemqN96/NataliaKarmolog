export interface Student {
  email: string;
  name: string;
  startDate: string; // ISO date string
  password: string;
  certificateUnlocked?: boolean;
  birthday?: string; // ISO date string YYYY-MM-DD
}

export function updateStudent(
  currentEmail: string,
  updates: Partial<Pick<Student, "email" | "password" | "birthday" | "name">>
): { ok: boolean; error?: string; student?: Student } {
  const students = getStudents();
  const idx = students.findIndex((s) => s.email === currentEmail);
  if (idx < 0) return { ok: false, error: "Студента не знайдено" };

  // Check new email not taken by another student
  if (updates.email && updates.email !== currentEmail) {
    const taken = students.find(
      (s) => s.email.toLowerCase() === updates.email!.toLowerCase()
    );
    if (taken) return { ok: false, error: "Email вже зайнятий" };
  }

  students[idx] = { ...students[idx], ...updates };
  saveStudents(students);

  // Refresh session
  const sessionRaw = typeof window !== "undefined"
    ? localStorage.getItem("sd_session") : null;
  if (sessionRaw) {
    const session = JSON.parse(sessionRaw) as Student;
    if (session.email === currentEmail || session.email === updates.email) {
      localStorage.setItem("sd_session", JSON.stringify(students[idx]));
    }
  }

  return { ok: true, student: students[idx] };
}

export function toggleCertificate(email: string): boolean {
  const students = getStudents();
  const idx = students.findIndex((s) => s.email === email);
  if (idx < 0) return false;
  students[idx].certificateUnlocked = !students[idx].certificateUnlocked;
  saveStudents(students);
  return !!students[idx].certificateUnlocked;
}

export function hasCertificateAccess(email: string): boolean {
  const students = getStudents();
  const s = students.find((s) => s.email === email);
  return !!s?.certificateUnlocked;
}

const STUDENTS_KEY = "sd_students";
const SESSION_KEY = "sd_session";

export function getStudents(): Student[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STUDENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function addStudent(student: Student): void {
  const students = getStudents();
  const existing = students.findIndex((s) => s.email === student.email);
  if (existing >= 0) {
    students[existing] = student;
  } else {
    students.push(student);
  }
  saveStudents(students);
}

export function login(email: string, password: string): Student | null {
  const students = getStudents();
  const student = students.find(
    (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
  );
  if (student) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(student));
    return student;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Student | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin2024";
