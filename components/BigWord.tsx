"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BigWord({ text, dir = 1 }: { text: string; dir?: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [`${12 * dir}%`, `${-12 * dir}%`]);
  return (
    <div ref={ref} className="bigword" aria-hidden="true">
      <motion.span style={{ x }}>{text} • {text} • {text}</motion.span>
    </div>
  );
}
