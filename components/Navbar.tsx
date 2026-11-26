"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Search, Menu, X, ChevronRight, MessageCircle } from "lucide-react";
import { socialIcon } from "./SocialIcons";
import ThemeToggle from "./ThemeToggle";
import { goTo } from "../lib/nav";
import { profile } from "../lib/data";

const links = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const inner = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) obs.observe(el); });
    const top = document.getElementById("top");
    const hero = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" });
    if (top) hero.observe(top);
    return () => { obs.disconnect(); hero.disconnect(); };
  }, []);

  // sliding pill under the active link
  useEffect(() => {
    const box = inner.current;
    if (!box) return;
    const place = () => {
      const a = box.querySelector<HTMLElement>(".nav-link.active");
      if (!a) { box.style.setProperty("--pw", "0px"); return; }
      box.style.setProperty("--pl", `${a.offsetLeft}px`);
      box.style.setProperty("--pw", `${a.offsetWidth}px`);
    };
    place();
    addEventListener("resize", place);
    return () => removeEventListener("resize", place);
  }, [active]);

  // mobile menu: lock scroll, Escape closes, focus first link
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setTimeout(() => first.current?.focus(), 50);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", key);
    return () => { document.body.style.overflow = ""; removeEventListener("keydown", key); };
  }, [open]);

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} />
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <motion.nav
        className="nav"
        aria-label="Primary"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner" ref={inner}>
          <a href="#" className="nav-logo">OFES<span> NASER</span></a>
          <span className="nav-links">
            <i className="nav-pill" aria-hidden="true" />
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={`nav-link ${active === l.id ? "active" : ""}`} aria-current={active === l.id ? "true" : undefined}>
                {l.label}
              </a>
            ))}
          </span>
          {profile.cv && <a className="nav-cv" href={profile.cv} download>CV</a>}
          <button className="kbd-btn" onClick={() => window.dispatchEvent(new Event("open-palette"))} aria-label="Open command menu">
            <Search size={14} /> <kbd>Ctrl K</kbd>
          </button>
          <ThemeToggle />
          <button className="icon-btn nav-burger" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </motion.nav>

      <div className={`msheet-bg ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div className={`msheet ${open ? "open" : ""}`} role="dialog" aria-label="Menu" aria-hidden={!open}>
        <nav className="msheet-links">
          {links.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} ref={i === 0 ? first : undefined} tabIndex={open ? 0 : -1}
              className={active === l.id ? "on" : ""} style={{ ["--i" as any]: i }}
              onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => goTo(l.id), 220); }}>
              <span>{l.label}</span>
              <ChevronRight size={16} />
            </a>
          ))}
        </nav>
        <div className="msheet-foot">
          <a href={profile.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" tabIndex={open ? 0 : -1}><MessageCircle size={18} /></a>
          {profile.socials.map((x) => {
            const Icon = socialIcon[x.icon];
            return <a key={x.label} href={x.href} target="_blank" rel="noreferrer" aria-label={x.label} tabIndex={open ? 0 : -1}><Icon size={18} /></a>;
          })}
        </div>
      </div>
    </>
  );
}
