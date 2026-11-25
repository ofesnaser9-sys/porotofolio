"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import Magnetic from "./Magnetic";
import Roll from "./Roll";
import ParticleField from "./ParticleField";
import { profile, roles } from "../lib/data";
import { discover } from "../lib/discover";
import { toast } from "../lib/theme";

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = roles[i];
    const t = setTimeout(
      () => {
        if (!del) {
          setText(word.slice(0, text.length + 1));
          if (text.length + 1 === word.length) setTimeout(() => setDel(true), 1200);
        } else {
          setText(word.slice(0, text.length - 1));
          if (text.length - 1 === 0) { setDel(false); setI((i + 1) % roles.length); }
        }
      },
      del ? 35 : 75
    );
    return () => clearTimeout(t);
  }, [text, del, i]);

  return <span className="type">{text}<i className="caret" /></span>;
}

// The name is the hero. Each letter leans toward and lights up near the cursor.
function KineticName() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current!;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".kch"));
    let raf = 0, mx = -9999, my = -9999, active = false;
    const frame = () => {
      raf = 0;
      const R = Math.max(150, root.getBoundingClientRect().height * 0.9);
      let any = false;
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy * 0.7);
        const p = Math.pow(Math.max(0, 1 - d / R), 1.6);
        if (p > 0.001) any = true;
        el.style.setProperty("--p", p.toFixed(3));
        el.style.setProperty("--dx", Math.max(-1, Math.min(1, dx / R)).toFixed(3));
      }
      if (any || active) { active = any; raf = requestAnimationFrame(frame); }
    };
    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; active = true; if (!raf) raf = requestAnimationFrame(frame); };
    const leave = () => { mx = my = -9999; if (!raf) raf = requestAnimationFrame(frame); };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.removeEventListener("mouseleave", leave); };
  }, []);

  const rows = ["OFES", "NASER"];
  let n = 0;
  return (
    <h1 className="kname" ref={ref} aria-label="OFES NASER">
      {rows.map((row) => (
        <span className="krow" key={row} aria-hidden="true">
          {[...row].map((c) => (
            <span className="kch" key={n} style={{ ["--i" as any]: n++ }}><b>{c}</b></span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// Gyroscope: real CSS 3D, driven by the shared --px/--py pointer variables.
function Gyro() {
  return (
    <div className="gyro" aria-hidden="true">
      <div className="gyro-rig">
        <i className="ring r1" /><i className="ring r2" /><i className="ring r3" />
      </div>
    </div>
  );
}

function Avatar() {
  const [err, setErr] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const hold = useRef<any>(0);
  const [spin, setSpin] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = wrap.current!, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 12).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 14).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    const el = wrap.current!;
    el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
    clearTimeout(hold.current);
  };
  const enter = () => { clearTimeout(hold.current); hold.current = setTimeout(() => discover("lens"), 1400); };
  const badge = () => {
    setSpin(true);
    setTimeout(() => setSpin(false), 1600);
    toast("Spinning up…");
    discover("badge");
  };

  return (
    <div className="photo-wrap tilt3d" ref={wrap} onMouseMove={onMove} onMouseEnter={enter} onMouseLeave={reset} data-cursor="Hover">
      <Gyro />
      <div className="photo">
        {!err ? (
          <picture>
            <source type="image/webp" srcSet="/me-480.webp 480w, /me-960.webp 960w" sizes="(max-width: 960px) 360px, 440px" />
            <img src={profile.photo} alt={profile.name} width={960} height={1280} fetchPriority="high" decoding="async" onError={() => setErr(true)} />
          </picture>
        ) : (
          <div className="photo-fallback">{profile.initials}</div>
        )}
        <div className="photo-shade" />
        <div className="reveal-layer" aria-hidden="true"><span>{"</>"}</span><span>UI</span><span>{"{ }"}</span></div>
        <div className="photo-rim" aria-hidden="true" />
        <div className="photo-tag">
          <span className="dot" /> {profile.name}
        </div>
      </div>

      <div className="chip chip-a" style={{ ["--f" as any]: "5s" }}>React</div>
      <div className="chip chip-b" style={{ ["--f" as any]: "6s" }}>Next.js</div>
      <div className="chip chip-c" style={{ ["--f" as any]: "4.5s" }}>TypeScript</div>

      <button type="button" className={`badge ${spin ? "spin" : ""}`} onClick={badge} aria-label="Available for work badge. Press to spin it" data-cursor="Spin">
        <svg className="badge-svg" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text fontSize="9.5" letterSpacing="2">
            <textPath href="#circ" textLength="284" lengthAdjust="spacing">
              AVAILABLE FOR WORK • OPEN TO PROJECTS •
            </textPath>
          </text>
        </svg>
        <span className="badge-core"><ArrowRight size={18} style={{ transform: "rotate(45deg)" }} /></span>
      </button>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Shared pointer state for the whole scene: --px/--py (-1..1, smoothed), --hx/--hy (px), --la (rim light angle).
  useEffect(() => {
    const el = ref.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("lite");
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, visible = true, pointer = false, t0 = performance.now();
    const photo = () => el.querySelector(".photo-wrap") as HTMLElement | null;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      if (!pointer) { const t = (performance.now() - t0) / 1000; tx = Math.sin(t * 0.5) * 0.35; ty = Math.cos(t * 0.37) * 0.25; }
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer = true;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty("--hx", `${e.clientX - r.left}px`);
      el.style.setProperty("--hy", `${e.clientY - r.top}px`);
      const p = photo();
      if (p) {
        const b = p.getBoundingClientRect();
        const a = Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * (180 / Math.PI) + 90;
        el.style.setProperty("--la", `${a.toFixed(1)}deg`);
      }
    };
    const leave = () => { pointer = false; t0 = performance.now(); };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    if (!reduce) raf = requestAnimationFrame(frame);
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  const tag = ["I", "design", "&", "build", "interfaces", "that", "feel", "alive."];

  return (
    <section className="hero" id="top" data-scene="hero" ref={ref}>
      <div className="hero-bg" />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <ParticleField />
      <div className="hero-spot" />
      <div className="hero-streak" aria-hidden="true" />
      <div className="container hero-stage">
        <div className="hero-left">
          <div className="status intro" style={{ ["--d" as any]: 0 }}>
            <span className="dot" />
            {profile.available ? "Available for new projects" : "Currently booked"}
          </div>

          <KineticName />

          <p className="hero-tag">
            {tag.map((w, i) => (
              <span className="word" key={i}>
                <span className={`intro-word ${w === "alive." ? "serif accent" : ""}`} style={{ ["--d" as any]: 5 + i * 0.7 }}>{w}</span>
              </span>
            ))}
          </p>

          <p className="role-line intro" style={{ ["--d" as any]: 11 }}>
            Hi, I'm <b>{profile.name}</b>, a <Typewriter />
          </p>

          <p className="lead intro" style={{ ["--d" as any]: 12 }}>{profile.intro}</p>

          <div className="cta-row intro" style={{ ["--d" as any]: 13 }}>
            <Magnetic>
              <a href="#work" className="btn btn-primary">
                <Roll>View my work</Roll> <ArrowRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-ghost">
                <Mail size={16} /> <Roll>Get in touch</Roll>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="hero-photo intro" style={{ ["--d" as any]: 7 }}>
          <Avatar />
        </div>
      </div>
      <a href="#about" className="scroll-cue intro" style={{ ["--d" as any]: 15 }} aria-label="Scroll to About">
        <i />
      </a>
    </section>
  );
}
