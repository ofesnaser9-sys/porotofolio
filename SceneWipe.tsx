"use client";
import { useEffect, useRef, useState } from "react";
import { reducedMotion, sceneNames } from "../lib/nav";
import { sound } from "../lib/sound";

// Long in-page jumps play a short "cut" with a title card. Short ones just glide.
export default function SceneWipe() {
  const el = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [label, setLabel] = useState({ n: "", name: "" });

  useEffect(() => {
    const target = (id: string) => (id === "top" ? 0 : (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY);

    const go = async (id: string) => {
      const y = Math.max(0, target(id));
      const dist = Math.abs(y - window.scrollY);
      const wrap = el.current;
      const done = () => history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);

      if (reducedMotion() || document.documentElement.classList.contains("lite") || !wrap || !wrap.animate || dist < innerHeight * 0.9 || busy.current) {
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(y, { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: reducedMotion() ? "auto" : "smooth" });
        done();
        return;
      }
      busy.current = true;
      const order = ["top", "about", "services", "work", "process", "skills", "contact"];
      setLabel({ n: String(order.indexOf(id) + 1).padStart(2, "0"), name: sceneNames[id] || id });
      wrap.style.visibility = "visible";
      sound.whoosh();
      const opts = { fill: "forwards" as const, easing: "cubic-bezier(.76,0,.24,1)" };
      await wrap.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { ...opts, duration: 420 }).finished;
      document.documentElement.style.scrollBehavior = "auto";
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "auto" });
      document.documentElement.style.scrollBehavior = "";
      done();
      await new Promise((r) => setTimeout(r, 260));
      await wrap.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 100%)" }], { ...opts, duration: 520 }).finished;
      wrap.style.visibility = "hidden";
      busy.current = false;
    };

    const onGo = (e: Event) => go((e as CustomEvent).detail);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1) || "top";
      if (id !== "top" && !document.getElementById(id)) return;
      e.preventDefault();
      go(id);
    };
    window.addEventListener("scene-go", onGo);
    document.addEventListener("click", onClick);
    // deep link on first load
    if (location.hash.length > 1) {
      const id = location.hash.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50);
    }
    return () => { window.removeEventListener("scene-go", onGo); document.removeEventListener("click", onClick); };
  }, []);

  return (
    <div className="wipe" ref={el} aria-hidden="true" style={{ visibility: "hidden" }}>
      <div className="wipe-card">
        <span>{label.n}</span>
        <b>{label.name}</b>
      </div>
    </div>
  );
}
