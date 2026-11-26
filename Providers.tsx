"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";

// Makes every framer-motion animation honour the visitor's "reduce motion" setting, and adds smooth scroll.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}
