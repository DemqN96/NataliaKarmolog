"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CountUpBadgeProps {
  target: number;
  suffix?: string;
  label: string;
}

export default function CountUpBadge({ target, suffix = "", label }: CountUpBadgeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const totalFrames = 70;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.round(eased * target));
      if (frame >= totalFrames) {
        setCount(target);
        clearInterval(timer);
      }
    }, 18);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-3"
      style={{
        backgroundColor: "#1a1612",
        border: "1px solid rgba(201,168,76,0.3)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-xs mb-0.5" style={{ color: "#7a6a60" }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}>
        {count}{suffix}
      </p>
    </motion.div>
  );
}
