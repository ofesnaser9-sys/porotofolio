"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight, Check, X } from "lucide-react";
import { Preview } from "./ProjectCard";
import { projects } from "../lib/data";
import { reducedMotion } from "../lib/nav";

// Opens from a project card. The card's browser frame morphs into the detail view (View Transitions),
// falling back to a simple fade where the API is missing.
export default function ProjectDetail() {
  const [i, setI] = useState<number | null>(null);
  const source = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const run = (update: () => void, from?: HTMLElement | null, to?: "open" | "close") => {
    const doc = document as any;
    if (!doc.startViewTransition || reducedMotion() || !from) { update(); return; }
    const name = (el: HTMLElement | null, v: string) => { if (el) (el.style as any).viewTransitionName = v; };
    if (to === "open") name(from, "pframe");
    const t = doc.startViewTransition(() => {
      flushSync(update);
      if (to === "open") name(from, "");
      else name(from, "pframe");
    });
    t.finished.finally(() => name(from, ""));
  };

  useEffect(() => {
    const open = (e: Event) => {
      const d = (e as CustomEvent).detail;
      source.current = d.source || null;
      opener.current = document.activeElement as HTMLElement;
      run(() => setI(d.i), source.current, "open");
    };
    window.addEventListener("open-project", open);
    return () => window.removeEventListener("open-project", open);
  }, []);

  const close = () => run(() => setI(null), source.current, "close");

  useEffect(() => {
    if (i === null) { document.body.style.overflow = ""; opener.current?.focus?.(); return; }
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [i]);

  const go = (d: number) => setI((cur) => (cur === null ? cur : (cur + d + projects.length) % projects.length));

  if (i === null) return null;
  const p = projects[i];
  return (
    <div className="pd" role="dialog" aria-modal="true" aria-label={`${p.title} details`} style={{ ["--brand" as any]: p.brand }} onClick={close}>
      <div className="pd-panel" onClick={(e) => e.stopPropagation()}>
        <button ref={closeBtn} className="icon-btn pd-close" onClick={close} aria-label="Close details"><X size={16} /></button>

        <div className="pd-visual">
          <div className="frame pd-frame" style={{ viewTransitionName: "pframe" } as any}>
            <div className="frame-bar"><i /><i /><i /><span className="frame-url">{p.title}</span></div>
            <div className="frame-screen">
              {p.image ? <img src={p.image} alt={p.title} decoding="async" /> : <Preview p={p} />}
            </div>
          </div>
        </div>

        <div className="pd-body">
          <div className="proj-meta"><span>{String(i + 1).padStart(2, "0")}</span><span className="proj-dot" /><span>{p.category}</span>{p.featured && <span className="proj-badge">Featured</span>}</div>
          <h3>{p.title}</h3>
          <p className="pd-desc">{p.description}</p>
          <dl className="pd-facts">
            <div><dt>Role</dt><dd>{p.role}</dd></div>
            <div><dt>Stack</dt><dd>{p.tags.join(", ")}</dd></div>
          </dl>
          <ul className="highlights">
            {p.highlights.map((h) => <li key={h}><Check size={14} /> {h}</li>)}
          </ul>
          <div className="pd-actions">
            {p.live && <a className="btn btn-primary" href={p.live} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight size={16} /></a>}
            {p.code && <a className="btn btn-ghost" href={p.code} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={16} /></a>}
          </div>
          <div className="pd-nav">
            <button type="button" onClick={() => go(-1)}>Previous: {projects[(i - 1 + projects.length) % projects.length].title}</button>
            <button type="button" onClick={() => go(1)}>Next: {projects[(i + 1) % projects.length].title}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
