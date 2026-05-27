"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Енергія та карма грошей",
    desc: "Зрозумієш, як формується фінансова карма, що таке егрегор фінансів і як духовність пов'язана з багатством",
  },
  {
    title: "Підсвідомі блоки",
    desc: "Розкопаєш родові фінансові сценарії, дитячі рішення про гроші та вторинні вигоди бідності",
  },
  {
    title: "Борги та злив енергії",
    desc: "Дізнаєшся звідки беруться борги, куди зливається енергія і отримаєш конкретні кроки до фінансової свободи",
  },
  {
    title: "Стан достатку",
    desc: "Сформуєш нову систему мислення, внутрішню опору та навчишся утримувати достаток у своєму житті",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export default function FeatureCards() {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          variants={item}
          whileHover={{
            y: -5,
            borderColor: "rgba(201,168,76,0.35)",
            boxShadow: "0 12px 40px rgba(201,168,76,0.09)",
          }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#1a1612", border: "1px solid #2a2420", cursor: "default" }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-5" style={{ width: "2rem", height: "2px", backgroundColor: "#c9a84c", borderRadius: "1px" }} />
          <p className="text-sm leading-relaxed" style={{ color: "#7a6a60" }}>{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
