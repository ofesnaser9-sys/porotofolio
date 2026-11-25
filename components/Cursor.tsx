"use client";
import { useEffect, useRef } from "react";

// Custom cursor. Fully imperative (no React state per mouse move) so it never costs a render.
// Elements can set data-cursor="Label" to turn the ring into a labelled lens.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const d = dot.current!, r = ring.current!, l = label.current!;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, text = "", mode = "";

    const setMode = (m: string, t: string) => {
      if (m !== mode) { r.className = `cursor-ring ${m}`; mode = m; }
      if (t !== text) { l.textContent = t; text = t; }
    };
    const loop = () => {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      d.style.transform = `translate3d(${x}px,${y}px,0)`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
      root.classList.add("cursor-on");
      const t = e.target as HTMLElement | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      if (tagged) setMode("label", tagged.dataset.cursor || "");
      else if (t?.closest?.("input, textarea")) setMode("text", "");
      else if (t?.closest?.("a, button, [data-hover]")) setMode("hover", "");
      else setMode("", "");
    };
    const down = () => r.classList.add("down");
    const up = () => r.classList.remove("down");
    const leave = () => root.classList.remove("cursor-on");
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span ref={label} /></div>
    </>
  );
}
