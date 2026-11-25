"use client";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";
import { profile } from "../lib/data";

function useLive() {
  const [v, setV] = useState({ time: "--:--", visit: 1 });
  useEffect(() => {
    let visit = 1;
    try {
      visit = (+(localStorage.getItem("visits") || "0")) + 1;
      if (!sessionStorage.getItem("visit-counted")) { localStorage.setItem("visits", String(visit)); sessionStorage.setItem("visit-counted", "1"); }
      else visit = +(localStorage.getItem("visits") || "1");
    } catch (e) {}
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" });
    const tick = () => setV({ time: fmt.format(new Date()), visit });
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);
  return v;
}

export default function About() {
  const live = useLive();
  return (
    <section id="about" data-scene="about">
      <div className="container">
        <Reveal>
          <div className="eyebrow">01 / About</div>
          <h2 className="title">
            Design-minded developer, <span className="serif accent">obsessed</span> with details.
          </h2>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <div className="term">
              <div className="term-bar">
                <i /><i /><i />
                <span>yosef.ts</span>
              </div>
              <pre>
{`​`}<span className="c">{"// who is behind the pixels"}</span>{"\n"}
<span className="k">const</span> <span className="v">yosef</span> = {"{"}{"\n"}
{"  "}<span className="p">role</span>: <span className="s">"{profile.role}"</span>,{"\n"}
{"  "}<span className="p">location</span>: <span className="s">"{profile.location}"</span>,{"\n"}
{"  "}<span className="p">stack</span>: [<span className="s">"React"</span>, <span className="s">"Next.js"</span>, <span className="s">"TypeScript"</span>],{"\n"}
{"  "}<span className="p">languages</span>: [<span className="s">"English"</span>, <span className="s">"Arabic"</span>],{"\n"}
{"  "}<span className="p">obsessions</span>: [<span className="s">"motion"</span>, <span className="s">"dark mode"</span>, <span className="s">"details"</span>],{"\n"}
{"  "}<span className="p">localTime</span>: <span className="s">"{live.time} {profile.city}"</span>,{"\n"}
{"  "}<span className="p">visit</span>: <span className="k">{live.visit}</span>,{"\n"}
{"  "}<span className="p">available</span>: <span className="k">{String(profile.available)}</span>,{"\n"}
{"}"};<i className="caret" />
              </pre>
            </div>
          </Reveal>

          <div className="about-side">
            <Reveal delay={0.08}>
              <SpotlightCard>
                <h3>Who I am</h3>
                <p>{profile.about}</p>
              </SpotlightCard>
            </Reveal>
            <Reveal delay={0.14}>
              <SpotlightCard>
                <h3>How I work</h3>
                <p>Clear communication, tidy code, and attention to the small things that users feel but rarely notice.</p>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
