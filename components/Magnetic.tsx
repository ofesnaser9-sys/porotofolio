"use client";
import { useEffect, useRef, type ReactNode } from "react";

// Pulls its child toward the cursor with a soft spring; releases with overshoot.
export default function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => {
    const el = ref.current!;
    const st = s.current;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const step = () => {
      st.vx = (st.vx + (st.tx - st.x) * 0.16) * 0.78;
      st.vy = (st.vy + (st.ty - st.y) * 0.16) * 0.78;
      st.x += st.vx; st.y += st.vy;
      el.style.transform = `translate3d(${st.x.toFixed(2)}px,${st.y.toFixed(2)}px,0)`;
      const rest = Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.tx - st.x) + Math.abs(st.ty - st.y) < 0.05;
      st.raf = rest ? 0 : requestAnimationFrame(step);
    };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(step); };
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      st.tx = (e.clientX - (r.left + r.width / 2)) * strength;
      st.ty = (e.clientY - (r.top + r.height / 2)) * strength;
      kick();
    };
    const leave = () => { st.tx = 0; st.ty = 0; kick(); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { cancelAnimationFrame(st.raf); el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);

  return <div ref={ref} style={{ display: "inline-block", willChange: "transform" }}>{children}</div>;
}
