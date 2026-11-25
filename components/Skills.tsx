"use client";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";
import { skills } from "../lib/data";

export default function Skills() {
  return (
    <section id="skills" data-scene="skills">
      <div className="container">
        <Reveal>
          <div className="eyebrow">05 / Skills</div>
          <h2 className="title">
            The <span className="serif accent">toolkit</span> behind the work.
          </h2>
        </Reveal>
        <div className="skills">
          {skills.map((s, i) => (
            <Reveal key={s.group} delay={i * 0.08}>
              <SpotlightCard>
                <h3>{s.group}</h3>
                <div className="skill-list">
                  {s.items.map((it) => (
                    <span className="tag" key={it}>{it}</span>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
