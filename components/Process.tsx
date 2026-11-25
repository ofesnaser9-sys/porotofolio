"use client";
import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import { process } from "../lib/data";

// A real sequence, so it gets a real timeline: the line draws as you scroll and each stage lights up.
export default function Process() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current!;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".step"));
    let raf = 0;
    const frame = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vertical = matchMedia("(max-width: 900px)").matches;
      const p = vertical
        ? Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height))
        : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.45)));
      el.style.setProperty("--p", p.toFixed(3));
      items.forEach((s, i) => s.classList.toggle("on", p >= (i + 0.4) / items.length));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    frame();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section id="process" data-scene="process">
      <div className="container">
        <Reveal>
          <div className="eyebrow">04 / Process</div>
          <h2 className="title">
            From idea to <span className="serif accent">launch</span>, in four steps.
          </h2>
        </Reveal>
        <div className="steps" ref={box}>
          <i className="steps-line" aria-hidden="true" />
          {process.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="step">
                <span className="step-node" aria-hidden="true" />
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
