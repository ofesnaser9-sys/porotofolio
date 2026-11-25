"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, currentTheme, type Theme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    sync();
    window.addEventListener("themechange", sync);
    return () => window.removeEventListener("themechange", sync);
  }, []);

  const toggle = () => {
    const r = ref.current?.getBoundingClientRect();
    applyTheme(theme === "dark" ? "light" : "dark", r ? r.left + r.width / 2 : undefined, r ? r.top + r.height / 2 : undefined);
  };

  return (
    <button ref={ref} className="icon-btn" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
