"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js is only downloaded after first paint (idle), so LCP is untouched.
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

// Fixed backdrop: a CSS gradient "blob" shows instantly, then the real 3D scene fades in over it.
export default function Scene3D() {
  const [mode, setMode] = useState<"wait" | "3d" | "static">("wait");
  const [ready, setReady] = useState(false);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as any;
    const weak = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2 || nav.connection?.saveData;
    setLite(document.documentElement.classList.contains("lite"));
    if (reduce || weak) { setMode("static"); return; }
    let id: any;
    const start = () => setMode("3d");
    if ("requestIdleCallback" in window) id = (window as any).requestIdleCallback(start, { timeout: 2500 });
    else id = setTimeout(start, 1200);
    return () => ("cancelIdleCallback" in window ? (window as any).cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  return (
    <div className="scene3d" aria-hidden="true">
      <div className={`scene3d-fb ${ready ? "off" : ""} ${mode === "static" ? "static" : ""}`} />
      {mode === "3d" && <Hero3D lite={lite} onReady={() => setReady(true)} />}
    </div>
  );
}
