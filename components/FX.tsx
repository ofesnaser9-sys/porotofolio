"use client";
import { useEffect } from "react";
import { sound } from "../lib/sound";
import { discover, unlockDirectors, found, discoveries } from "../lib/discover";
import { goTo } from "../lib/nav";

// Global micro-interactions: press ripples, optional sound, theme-flip + konami discoveries.
export default function FX() {
  useEffect(() => {
    sound.init();
    try { if (localStorage.getItem("directors") === "1" && found().length >= discoveries.length) unlockDirectors(true); } catch (e) {}

    const down = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest?.(".btn, .icon-btn, .kbd-btn") as HTMLElement | null;
      if (!b) return;
      sound.click();
      if (!b.classList.contains("btn") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = b.getBoundingClientRect();
      const s = document.createElement("span");
      const d = Math.max(r.width, r.height) * 2;
      s.className = "ripple";
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    };
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.("a, button")) sound.tick();
    };

    let flips: number[] = [];
    const theme = () => {
      const n = performance.now();
      flips = flips.filter((t) => n - t < 4000).concat(n);
      if (flips.length >= 3) { flips = []; discover("lights"); }
    };

    const code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let pos = 0;
    const key = (e: KeyboardEvent) => {
      pos = e.key.toLowerCase() === code[pos] ? pos + 1 : e.key.toLowerCase() === code[0] ? 1 : 0;
      if (pos === code.length) { pos = 0; discover("konami"); }
    };

    document.addEventListener("pointerdown", down);
    document.addEventListener("mouseover", over);
    window.addEventListener("themechange", theme);
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("themechange", theme);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return null;
}
