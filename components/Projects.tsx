"use client";
import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { projects } from "../lib/data";

// Desktop: cards stack like a deck as you scroll; the one on top sets the section's ambient colour.
export default function Projects() {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = list.current!;
    const items = Array.from(box.querySelectorAll<HTMLElement>(".stack-item"));
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stacked = () => matchMedia("(min-width: 961px) and (min-height: 700px)").matches;
    let raf = 0, current = -1;

    const frame = () => {
      raf = 0;
      const on = stacked() && !reduce;
      let top = 0;
      items.forEach((it, i) => {
        const r = it.getBoundingClientRect();
        const stick = parseFloat(getComputedStyle(it).top) || 0;
        if (r.top <= stick + 4 && r.bottom > 0) top = i;
        if (!on) { it.style.setProperty("--sc", "1"); it.style.setProperty("--cv", "0"); return; }
        const next = items[i + 1];
        let cover = 0;
        if (next) {
          const nt = next.getBoundingClientRect().top;
          cover = Math.min(1, Math.max(0, 1 - (nt - stick) / r.height));
        }
        it.style.setProperty("--sc", (1 - cover * 0.06).toFixed(4));
        it.style.setProperty("--cv", (cover * 0.55).toFixed(3));
      });
      if (top !== current) { current = top; root.style.setProperty("--scene-brand", projects[top].brand); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    frame();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section id="work" data-scene="work">
      <div className="container">
        <Reveal>
          <div className="eyebrow">03 / Selected work · {projects.length} projects</div>
          <h2 className="title">
            Things I've designed and <span className="serif accent">built</span>.
          </h2>
          <p className="lead">Each one with its own identity, colours and personality. Hover a card to explore.</p>
        </Reveal>

        <div className="projects" ref={list}>
          {projects.map((p, i) => (
            <div className="stack-item" key={p.title} style={{ ["--n" as any]: i }}>
              <Reveal>
                <ProjectCard p={p} i={i} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
