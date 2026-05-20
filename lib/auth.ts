export interface Student {
  email: string;
  name: string;
  startDate: string; // ISO date string
  password: string;
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

export const ADMIN_PASSWORD = {$Password};
