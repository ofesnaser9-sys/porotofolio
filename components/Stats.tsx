"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import Reveal from "./Reveal";
import { stats } from "../lib/data";

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);

  return <span ref={ref}>{v}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="stats-section" data-scene="hero">
      <div className="container stats-grid">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="stat">
              <b><Count to={s.value} suffix={s.suffix} /></b>
              <span>{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
