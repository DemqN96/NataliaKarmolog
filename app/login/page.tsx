"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { login, getSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const student = await login(email.trim(), password);
    if (student) {
      router.push("/dashboard");
    } else {
      setError("Невірний email або пароль");
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#0a0806" }}
    >
      {/* Ambient orbs */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 260, height: 260,
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          top: "15%", right: "10%",
        }}
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 180, height: 180,
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
          bottom: "15%", left: "8%",
        }}
        animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          {/* Decorative diamond */}
          <motion.div
            className="flex justify-center mb-5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <div
              className="w-12 h-12 rotate-45 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                border: "1px solid rgba(201,168,76,0.3)",
              }}
            >
              <span className="-rotate-45 text-lg">✦</span>
            </div>
          </motion.div>

          <Link href="/">
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}>
              Стан <span className="text-gold-gradient">Достатку</span>
            </h1>
          </Link>

          {/* Ornament line */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4))" }} />
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(201,168,76,0.5)" }}>Вхід</span>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)" }} />
          </div>

          <p className="mt-3 text-sm" style={{ color: "#5a4a40" }}>
            Введіть дані для входу до курсу
          </p>
        </div>

        {/* Card */}
        <motion.div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{
            backgroundColor: "#14110d",
            border: "1px solid rgba(201,168,76,0.18)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.06)",
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Subtle top glow inside card */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)" }}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#6a5a50" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300"
                style={{ backgroundColor: "#0f0d0a", border: "1px solid #2a2420", color: "#f5f0e8", caretColor: "#c9a84c" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.6)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08), inset 0 0 20px rgba(201,168,76,0.03)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2a2420";
                  e.target.style.boxShadow = "none";
                }}
              />
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#6a5a50" }}>
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 pr-20"
                  style={{ backgroundColor: "#0f0d0a", border: "1px solid #2a2420", color: "#f5f0e8", caretColor: "#c9a84c" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(201,168,76,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08), inset 0 0 20px rgba(201,168,76,0.03)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#2a2420";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded transition-opacity hover:opacity-70"
                  style={{ color: "#6a5a50" }}
                >
                  {showPass ? "Сховати" : "Показати"}
                </button>
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center gap-2 rounded-xl px-4 py-3"
                  style={{ backgroundColor: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.2)" }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-sm" style={{ color: "#ff8a8a" }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button type="submit" disabled={loading} className="btn-gold w-full text-base py-3.5 mt-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      style={{ display: "inline-block", width: 15, height: 15, border: "2px solid rgba(0,0,0,0.25)", borderTopColor: "#0f0d0a", borderRadius: "50%" }}
                    />
                    Вхід...
                  </span>
                ) : "Увійти →"}
              </button>
            </motion.div>
          </form>

          {/* Bottom ornament */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid #1e1a16" }}>
            <p className="text-center text-sm" style={{ color: "#4a3a30" }}>
              Ще не маєте доступу?{" "}
              <Link href="/" style={{ color: "#c9a84c" }} className="hover:opacity-80 transition-opacity">
                Дізнатись про курс
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
