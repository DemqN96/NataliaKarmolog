"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="fixed bottom-8 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "#1a1612",
            border: "1px solid rgba(201,168,76,0.25)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.25 }}
          whileHover={{
            borderColor: "rgba(201,168,76,0.7)",
            boxShadow: "0 4px 24px rgba(201,168,76,0.2)",
            scale: 1.08,
          }}
          whileTap={{ scale: 0.93 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Вгору"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
