"use client";

import { useEffect, useState } from "react";

interface Props {
  unlockDay: number;   // lesson.day
  startDate: string;   // student.startDate (YYYY-MM-DD)
}

export default function UnlockCountdown({ unlockDay, startDate }: Props) {
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    function calc() {
      const start = new Date(startDate);
      const unlockAt = new Date(start.getTime() + unlockDay * 24 * 60 * 60 * 1000);
      const diff = unlockAt.getTime() - Date.now();
      if (diff <= 0) { setRemaining(null); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining({ d, h, m, s });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [unlockDay, startDate]);

  if (!remaining) return null;

  const soonColor = remaining.d === 0 && remaining.h < 1;

  return (
    <span
      className="text-[10px] tabular-nums"
      style={{ color: soonColor ? "#c9a84c" : "#4a3a30" }}
    >
      {remaining.d > 0 && `${remaining.d}д `}
      {remaining.h > 0 && `${remaining.h}г `}
      {`${remaining.m}хв`}
      {remaining.d === 0 && ` ${remaining.s}с`}
    </span>
  );
}
