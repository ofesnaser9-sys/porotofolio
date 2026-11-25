"use client";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "../lib/theme";
import { sound } from "../lib/sound";
import { discover, discoveries, found } from "../lib/discover";

const sets = [
  { n: "Crimson", a: "#f0294f", h: "#ff4a6b", s: "rgba(240,41,79,.14)" },
  { n: "Violet", a: "#8b5cf6", h: "#a78bfa", s: "rgba(139,92,246,.15)" },
  { n: "Cyan", a: "#06b6d4", h: "#22d3ee", s: "rgba(6,182,212,.15)" },
];

function setAccent(i: number) {
  const r = document.documentElement.style, c = sets[i];
  r.setProperty("--accent", c.a); r.setProperty("--accent-hover", c.h); r.setProperty("--accent-soft", c.s);
  try { localStorage.setItem("accent", String(i)); } catch (e) {}
  window.dispatchEvent(new Event("accentchange"));
}

// Bottom-left control cluster: accent colours, sound toggle, hidden-detail counter.
// Also owns the original easter egg (type "ofes" or click the logo 5x).
export default function Dock() {
  const [snd, setSnd] = useState(false);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    try { const v = localStorage.getItem("accent"); if (v) { setAccent(+v); setActive(+v); } } catch (e) {}
    setSnd(sound.init());
    const sync = () => setCount(found().length);
    sync();
    window.addEventListener("discover", sync);

    let buf = "", clicks = 0, tm: any;
    const rainbow = () => {
      document.documentElement.classList.add("rainbow");
      toast("✦ Secret mode unlocked");
      discover("secret");
      setTimeout(() => document.documentElement.classList.remove("rainbow"), 7000);
    };
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches?.("input,textarea")) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf === "ofes") rainbow();
    };
    const click = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".nav-logo")) return;
      clicks++; clearTimeout(tm); tm = setTimeout(() => (clicks = 0), 900);
      if (clicks >= 5) { clicks = 0; rainbow(); }
    };
    addEventListener("keydown", key); addEventListener("click", click);
    return () => { removeEventListener("keydown", key); removeEventListener("click", click); window.removeEventListener("discover", sync); };
  }, []);

  const toggleSound = () => { sound.set(!snd); setSnd(!snd); toast(!snd ? "Sound on" : "Sound off"); };

  return (
    <div className="dock">
      <div className="accent-switch" role="group" aria-label="Accent colour">
        {sets.map((c, i) => (
          <button key={c.n} title={c.n} aria-label={c.n} aria-pressed={active === i} className={active === i ? "on" : ""} style={{ background: c.a }}
            onClick={() => { setAccent(i); setActive(i); }} />
        ))}
      </div>
      <button className="dock-btn" onClick={toggleSound} aria-pressed={snd} aria-label={snd ? "Turn sound off" : "Turn sound on"} title="Interface sounds">
        {snd ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>
      <button className="dock-btn dock-count" aria-label={`Hidden details found: ${count} of ${discoveries.length}. Press for a hint`}
        title="Hidden details. Press for a hint" onClick={() => window.dispatchEvent(new Event("hint"))}>
        <span aria-hidden="true">◆</span> {count}/{discoveries.length}
      </button>
    </div>
  );
}
