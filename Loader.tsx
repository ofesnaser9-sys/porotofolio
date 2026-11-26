"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const name = "OFES NASER".split("");

// Real loading: waits for fonts and the portrait, with a minimum so the intro never flashes.
export default function Loader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const beam = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("ofes-seen") === "1"; } catch (e) {}
    const lite = root.classList.contains("lite");
    const min = reduce ? 250 : seen ? 500 : lite ? 1100 : 1800;
    document.body.style.overflow = "hidden";

    let ready = false;
    const img = new Image();
    const photo = new Promise<void>((res) => { img.onload = img.onerror = () => res(); img.src = "/me-960.webp"; });
    const fonts = (document as any).fonts?.ready ?? Promise.resolve();
    Promise.all([photo, fonts]).then(() => (ready = true));
    const cap = setTimeout(() => (ready = true), 4500);

    const t0 = performance.now();
    let raf = 0, p = 0, finished = false;
    const tick = (now: number) => {
      const el = now - t0;
      const target = ready ? 100 : Math.min(88, (el / min) * 88);
      p += (Math.min(target, (el / min) * 100) - p) * 0.12;
      if (p > 99.4 && ready && el >= min) p = 100;
      const v = Math.round(p);
      setPct(v);
      if (beam.current) beam.current.style.transform = `scaleX(${p / 100})`;
      if (p >= 100 && !finished) {
        finished = true;
        try { sessionStorage.setItem("ofes-seen", "1"); } catch (e) {}
        setDone(true);
        document.body.style.overflow = "";
        root.dataset.ready = "1";
        window.dispatchEvent(new Event("ofes-ready"));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(cap); document.body.style.overflow = ""; };
  }, []);

  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="curtain" role="status" aria-label="Loading" exit={{ transition: { duration: 1.2 } }}>
          {/* two stacked layers lift away like a curtain: accent edge first, then the page background */}
          <motion.i className="curtain-accent" initial={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.95, delay: 0.12, ease }} />
          <motion.i className="curtain-bg" initial={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.95, ease }} />
          <motion.div className="curtain-name" aria-hidden="true" exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
            {name.map((c, i) => (
              <span className="mk" key={i}>
                <motion.span initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>{c === " " ? "\u00A0" : c}</motion.span>
              </span>
            ))}
          </motion.div>
          <motion.b className="curtain-beam" ref={beam as any} style={{ transform: "scaleX(0)" }} exit={{ opacity: 0 }} />
          <motion.div className="curtain-meta" exit={{ opacity: 0 }}>
            <span>Frontend Developer</span>
            <span className="curtain-pct">{String(pct).padStart(3, "0")}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
