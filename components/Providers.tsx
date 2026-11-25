"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Makes every framer-motion animation honour the visitor's "reduce motion" setting.
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
