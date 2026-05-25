"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StaggerListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  delay?: number;
}

export default function StaggerList({
  children,
  className = "",
  itemClassName = "",
  delay = 0,
}: StaggerListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={item} className={itemClassName}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
