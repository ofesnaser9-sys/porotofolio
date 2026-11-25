"use client";
import { ArrowUp } from "lucide-react";
import { profile } from "../lib/data";
import { discover } from "../lib/discover";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved. <button type="button" className="foot-gem" aria-label="A small gem" onClick={() => discover("gem")}>◆</button></span>
        <span className="foot-hint">Press <kbd>Ctrl K</kbd> anywhere</span>
        <div className="socials">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
          ))}
          <a href="#" aria-label="Back to top"><ArrowUp size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
