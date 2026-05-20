"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, getSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const student = login(email.trim(), password);
    if (student) {
      router.push("/dashboard");
    } else {
      setError("Невірний email або пароль. Зверніться до адміністратора.");
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="text-3xl font-bold" style={{ color: "#f5f0e8" }}>
              Стан <span style={{ color: "#c9a84c" }}>Достатку</span>
            </h1>
          </Link>
          <p className="mt-2 text-sm" style={{ color: "#a09080" }}>
            Увійдіть, щоб отримати доступ до уроків
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#d4c9b8" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "#0f0d0a",
                  border: "1px solid #3a3430",
                  color: "#f5f0e8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                onBlur={(e) => (e.target.style.borderColor = "#3a3430")}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#d4c9b8" }}
              >
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
                style={{
                  backgroundColor: "#0f0d0a",
                  border: "1px solid #3a3430",
                  color: "#f5f0e8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#c9a84c")}
                onBlur={(e) => (e.target.style.borderColor = "#3a3430")}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full"
            >
              {loading ? "Завантаження..." : "Увійти"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#a09080" }}>
            Ще не маєте доступу?{" "}
            <a
              href="/"
              style={{ color: "#c9a84c" }}
              className="hover:underline"
            >
              Дізнатись про курс
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
