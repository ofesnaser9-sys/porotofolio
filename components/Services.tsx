"use client";
import { Layers, Code, Globe, Zap } from "lucide-react";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";
import { services } from "../lib/data";

const icons: Record<string, any> = { layout: Layers, code: Code, globe: Globe, zap: Zap };

export default function Services() {
  return (
    <section id="services" data-scene="services">
      <div className="container">
        <Reveal>
          <div className="eyebrow">02 / Services</div>
          <h2 className="title">
            What I can <span className="serif accent">build</span> for you.
          </h2>
        </Reveal>
        <div className="services">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.title} delay={i * 0.07}>
                <SpotlightCard className="service">
                  <div className="service-top">
                    <span className="service-icon"><Icon size={20} /></span>
                    <span className="service-n">0{i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
