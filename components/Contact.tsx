"use client";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Copy, ArrowUpRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import Roll from "./Roll";
import { toast } from "../lib/theme";
import { profile } from "../lib/data";
import { socialIcon } from "./SocialIcons";

export default function Contact() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(profile.email);
    toast("Email copied to clipboard");
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${msg}\n\n${name}${from ? ` (${from})` : ""}`);
    setSent(true);
    toast("Opening your email app…");
    setTimeout(() => setSent(false), 3500);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact" data-scene="contact">
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ justifyContent: "center" }}>06 / Contact</div>
          <h2 className="title">
            Let's build something <span className="serif accent">great</span> together.
          </h2>
          <p className="lead">Have a project in mind or just want to say hi? My inbox is always open.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mail-pill">
            <a href={`mailto:${profile.email}`} className="mail-text">{profile.email}</a>
            <button className="icon-btn" onClick={copy} aria-label="Copy email"><Copy size={15} /></button>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="cta-row">
            <Magnetic>
              <a href={`tel:+2${profile.phone}`} className="btn btn-ghost"><Phone size={16} /> {profile.phone}</a>
            </Magnetic>
            <div className="wa-group">
              <Magnetic>
                <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <MessageCircle size={16} /> <Roll>WhatsApp</Roll>
                </a>
              </Magnetic>
              {profile.socials.filter((x) => x.icon !== "github").map((x) => {
                const Icon = socialIcon[x.icon];
                return (
                  <a key={x.label} href={x.href} target="_blank" rel="noreferrer" className="soc-btn" aria-label={x.label} title={x.label}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <form className="form" onSubmit={send}>
            <div className="form-row">
              <label className="field"><input value={name} onChange={(e) => setName(e.target.value)} placeholder=" " autoComplete="name" required /><span>Your name</span></label>
              <label className="field"><input value={from} onChange={(e) => setFrom(e.target.value)} placeholder=" " type="email" autoComplete="email" required /><span>Your email</span></label>
            </div>
            <label className="field"><textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder=" " rows={5} required
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") (e.currentTarget.form as HTMLFormElement).requestSubmit(); }} /><span>Tell me about your project</span></label>
            <button className={`btn btn-primary ${sent ? "is-sent" : ""}`} type="submit">
              {sent ? <Check size={16} /> : <Mail size={16} />} <Roll>{sent ? "Opening your email app" : "Send message"}</Roll> <ArrowUpRight size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
