"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { applyTheme, currentTheme, toast } from "../lib/theme";
import { profile, projects } from "../lib/data";
import { goTo } from "../lib/nav";
import { sound } from "../lib/sound";
import { nextHint, directorsUnlocked, unlockDirectors } from "../lib/discover";

type Item = { label: string; hint: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (id: string) => () => goTo(id);

  const items: Item[] = useMemo(() => {
    const base: Item[] = [
      { label: "Go to About", hint: "Navigate", run: go("about") },
      { label: "Go to Services", hint: "Navigate", run: go("services") },
      { label: "Go to Work", hint: "Navigate", run: go("work") },
      { label: "Go to Process", hint: "Navigate", run: go("process") },
      { label: "Go to Skills", hint: "Navigate", run: go("skills") },
      { label: "Go to Contact", hint: "Navigate", run: go("contact") },
      {
        label: "Toggle dark / light theme",
        hint: "Action",
        run: () => applyTheme(currentTheme() === "dark" ? "light" : "dark"),
      },
      {
        label: "Copy email address",
        hint: "Action",
        run: () => { navigator.clipboard?.writeText(profile.email); toast("Email copied"); },
      },
      { label: "Toggle interface sounds", hint: "Action", run: () => { sound.set(!sound.on); toast(sound.on ? "Sound on" : "Sound off"); } },
      { label: "Give me a hint", hint: "Explore", run: () => toast(nextHint()) },
      { label: "Send an email", hint: "Contact", run: () => (window.location.href = `mailto:${profile.email}`) },
      { label: "Chat on WhatsApp", hint: "Contact", run: () => window.open(profile.whatsapp, "_blank") },
      ...profile.socials.filter((x) => x.icon !== "github").map((x) => ({ label: `Open ${x.label}`, hint: "Contact", run: () => window.open(x.href, "_blank") })),
    ];
    if (profile.cv) base.push({ label: "Download CV", hint: "Contact", run: () => window.open(profile.cv, "_blank") });
    if (directorsUnlocked()) {
      base.push({ label: "Toggle Director's cut", hint: "Unlocked", run: () => unlockDirectors(!document.documentElement.classList.contains("directors")) });
    }
    projects.forEach((p) => {
      if (p.live) base.push({ label: `Open ${p.title}`, hint: "Project", run: () => window.open(p.live, "_blank") });
    });
    return base;
  }, [open]);

  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const openEv = () => setOpen(true);
    const hintEv = () => toast(nextHint());
    window.addEventListener("hint", hintEv);
    window.addEventListener("keydown", key);
    window.addEventListener("open-palette", openEv);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("open-palette", openEv);
      window.removeEventListener("hint", hintEv);
    };
  }, []);

  useEffect(() => {
    if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const choose = (i: Item | undefined) => { if (!i) return; setOpen(false); setTimeout(i.run, 120); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") choose(filtered[idx]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="palette-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            className="palette" role="dialog" aria-modal="true" aria-label="Command menu"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-input">
              <Search size={16} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                onKeyDown={onKey}
                placeholder="Type a command or search..." aria-label="Search commands" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={`pal-${idx}`}
              />
              <kbd>Esc</kbd>
            </div>
            <div className="palette-list" id="palette-list" role="listbox">
              {filtered.length === 0 && <div className="palette-empty">No results</div>}
              {filtered.map((i, n) => (
                <button
                  key={i.label}
                  id={`pal-${n}`} role="option" aria-selected={n === idx}
                  className={`palette-item ${n === idx ? "on" : ""}`}
                  onMouseEnter={() => setIdx(n)}
                  onClick={() => choose(i)}
                >
                  <span>{i.label}</span>
                  <small>{n === idx ? <CornerDownLeft size={12} /> : i.hint}</small>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
