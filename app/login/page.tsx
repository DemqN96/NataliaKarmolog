"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { login, getSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const student = login(email.trim(), password);
    if (student) {
      router.push("/dashboard");
    } else {
      setError("Невірний email або пароль.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#0f0d0a" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="text-center mb-10">
          <Link href="/">
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Стан <span style={{ color: "#c9a84c" }}>Достатку</span>
            </h1>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "#6a5a50" }}>
            Введіть дані для входу до курсу
          </p>
        </div>

        <motion.div
          className="rounded-3xl p-8"
          style={{ backgroundColor: "#1a1612", border: "1px solid rgba(201,168,76,0.15)" }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Email", type: "email", value: email, setter: setEmail, placeholder: "your@email.com" },
              { label: "Пароль", type: "password", value: password, setter: setPassword, placeholder: "••••••••" },
            ].map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: "#d4c9b8" }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required
                  placeholder={field.placeholder}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300"
                  style={{ backgroundColor: "#0f0d0a", border: "1px solid #3a3430", color: "#f5f0e8" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c9a84c";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#3a3430";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>
            ))}

            {error && (
              <motion.p
                className="text-sm text-center"
                style={{ color: "#ff6b6b" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <button type="submit" disabled={loading} className="btn-gold w-full text-base py-3.5">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #0f0d0a", borderTopColor: "transparent", borderRadius: "50%" }}
                    />
                    Завантаження...
                  </span>
                ) : "Увійти →"}
              </button>
            </motion.div>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6a5a50" }}>
            Ще не маєте доступу?{" "}
            <Link href="/" style={{ color: "#c9a84c" }} className="hover:underline">
              Дізнатись про курс
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
