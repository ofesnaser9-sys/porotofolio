"use client";
import type { ReactNode, MouseEvent } from "react";

// Cursor-following light. With `tilt`, the card also leans toward the pointer in 3D.
export default function SpotlightCard({
  children,
  className = "",
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (tilt) {
      el.style.setProperty("--rx", `${((0.5 - y / r.height) * 7).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x / r.width - 0.5) * 9).toFixed(2)}deg`);
    }
  };
  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <div className={`card ${tilt ? "tilt-card" : ""} ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
