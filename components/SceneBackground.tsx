"use client";
import { useEffect, useRef } from "react";

// One fixed backdrop whose colour follows the section you are in, and whose light
// drifts with scroll.
export default function SceneBackground() {
  const a = useRef<HTMLElement>(null);
  const b = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || root.classList.contains("lite");

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) root.dataset.scene = (e.target as HTMLElement).dataset.scene || "hero"; }),
      { rootMargin: "-50% 0px -50% 0px" }
    );
    document.querySelectorAll("[data-scene]").forEach((s) => io.observe(s));

    let raf = 0;
    const frame = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = y / max;
      if (!reduce) {
        if (a.current) a.current.style.transform = `translate3d(${(p * 38 - 10).toFixed(2)}vw, ${(p * 30).toFixed(2)}vh, 0)`;
        if (b.current) b.current.style.transform = `translate3d(${(60 - p * 46).toFixed(2)}vw, ${(70 - p * 50).toFixed(2)}vh, 0)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <i ref={a as any} className="scene-a" />
      <i ref={b as any} className="scene-b" />
    </div>
  );
}
