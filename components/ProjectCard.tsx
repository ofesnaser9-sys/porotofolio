"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import type { Project } from "../lib/data";
import { openProject } from "../lib/project";

export function Preview({ p }: { p: Project }) {
  const v = {
    "--pv-bg": p.pv.bg,
    "--pv-ink": p.pv.ink,
    "--pv-accent": p.pv.accent,
    "--pv-nav": p.pv.nav,
    "--pv-nav-ink": p.pv.navInk,
    "--pv-img": p.pv.img || "transparent",
  } as CSSProperties;

  return (
    <div className="pv" style={v}>
      <div className="pv-nav">
        <span className="pv-logo">{p.pv.logo}</span>
        <span className="pv-links"><i /><i /><i /><i /></span>
      </div>
      <div className={`pv-hero ${p.layout === "center" ? "center" : ""}`}>
        <div className="pv-text">
          <div className="pv-h">{p.pv.headline}</div>
          <div className="pv-line" style={{ width: "86%" }} />
          <div className="pv-line" style={{ width: "64%" }} />
          <div className="pv-btns">
            <span className="pv-btn" />
            <span className="pv-btn o" />
          </div>
        </div>
        {p.layout === "split" && <div className="pv-img" />}
      </div>
    </div>
  );
}

export default function ProjectCard({ p, i }: { p: Project; i: number }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 16 });

  const spot = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <div className={`card project ${i % 2 ? "rev" : ""}`} style={{ "--brand": p.brand } as CSSProperties} onMouseMove={spot}>
      <div className="project-visual" onMouseMove={tilt} onMouseLeave={reset} data-cursor="Open"
        onClick={(e) => openProject(i, e.currentTarget.querySelector(".frame") as HTMLElement)}>
        <motion.div className="tilt" style={{ rotateX, rotateY }}>
          <div className="frame">
            <div className="frame-bar">
              <i /><i /><i />
              <span className="frame-url">{p.title}</span>
            </div>
            <div className="frame-screen">
              {p.image ? <img src={p.image} alt={p.title} loading="lazy" decoding="async" /> : <Preview p={p} />}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="project-body">
        <div className="proj-meta">
          <span>0{i + 1}</span>
          <span className="proj-dot" />
          <span>{p.category}</span>
          {p.featured && <span className="proj-badge">Featured</span>}
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <ul className="highlights">
          {p.highlights.map((h) => (
            <li key={h}><Check size={14} /> {h}</li>
          ))}
        </ul>
        <div className="tags">
          {p.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="proj-foot">
          <span className="role">{p.role}</span>
          <div className="links">
            <button type="button" className="link-btn" onClick={(e) => openProject(i, (e.currentTarget.closest(".project") as HTMLElement).querySelector(".frame") as HTMLElement)}>
              Details <ArrowUpRight size={16} />
            </button>
            {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a>}
            {p.code && <a href={p.code} target="_blank" rel="noreferrer">Source <ArrowUpRight size={16} /></a>}
          </div>
        </div>
      </div>
    </div>
  );
}
