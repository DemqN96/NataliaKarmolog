"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

const reviews = [
  { src: "/review-1.png", alt: "Відгук учасниці курсу" },
  { src: "/review-2.png", alt: "Відгук учасниці курсу" },
  { src: "/review-3.png", alt: "Відгук учасниці курсу" },
  { src: "/review-4.png", alt: "Відгук учасниці курсу" },
  { src: "/review-5.png", alt: "Відгук учасниці курсу" },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          <h2
            className="text-4xl font-bold text-center mb-3"
            style={{ fontFamily: "var(--font-playfair)", color: "#f5f0e8" }}
          >
            Що кажуть учасниці
          </h2>
          <p className="text-center mb-12" style={{ color: "#6a5a50" }}>
            Реальні відгуки людей, які вже проходять курс
          </p>
        </FadeIn>

        {/* Desktop: masonry-like 3-col layout */}
        <div className="hidden md:grid grid-cols-3 gap-5 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            <ReviewImage r={reviews[0]} delay={0} />
            <ReviewImage r={reviews[3]} delay={0.2} />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-5 mt-8">
            <ReviewImage r={reviews[1]} delay={0.1} />
            <ReviewImage r={reviews[4]} delay={0.25} />
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-5">
            <ReviewImage r={reviews[2]} delay={0.15} />
          </div>
        </div>

        {/* Mobile: horizontal scroll */}
        <div
          className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {reviews.map((r, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[80vw]">
              <ReviewImage r={r} delay={0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewImage({
  r,
  delay,
}: {
  r: { src: string; alt: string };
  delay: number;
}) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #2a2420",
        boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(201,168,76,0.3)",
        boxShadow: "0 12px 40px rgba(201,168,76,0.08)",
      }}
    >
      <Image
        src={r.src}
        alt={r.alt}
        width={600}
        height={900}
        className="w-full h-auto block"
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  );
}
