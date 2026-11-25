# OFES NASER Portfolio (v4)

    npm install
    npm run dev

- All content: lib/data.ts
- Your photo: public/me.jpg (original, untouched). Optimised copies me-480.webp / me-960.webp are served automatically.
- Project screenshots: public/projects/ then set `image: "/projects/name.png"` in lib/data.ts
- Ctrl+K opens the command menu

## What's new in v4
- Hero: kinetic name (letters react to the cursor), real CSS 3D gyroscope + cube, rim light that follows the cursor, pointer parallax.
- Scene system: backdrop colour changes per section; scroll-velocity effects; cinematic wipe between distant sections.
- Work section stacks like a deck on desktop and tints the page with each project's brand colour.
- Process is a scroll-drawn timeline. Skills swell near the cursor. Services tilt in 3D.
- Labelled custom cursor (`data-cursor="Label"` on any element), magnetic buttons, label-roll hover, press ripples.
- Mobile menu, sliding nav pill, skip link, focus styles, reduced-motion support everywhere.
- Real loader (waits for fonts and portrait). Optional interface sounds (off by default, bottom-left).
- 6 hidden details to find (counter bottom-left). Finding all unlocks Director's cut. Ctrl+K > "Give me a hint".

## Notes
- Contact form opens the visitor's email app (mailto). Connect a service (Formspree, Resend) if you want in-page sending.
- Update the GitHub / LinkedIn links in lib/data.ts (they still point to the site home pages).

## v5 additions
- Calmer visuals: the name + gyroscope are the star; removed cube/shards, card tilt, border sweeps, marquee skew, skills swell.
- Fonts: Bricolage Grotesque (headings) + Instrument Sans (body) + Instrument Serif italic + JetBrains Mono.
- Project details view (click a card or "Details"): the browser frame morphs into the detail panel. Arrow keys switch project, Esc closes.
- Share image: public/og.png (1200x630) used by WhatsApp/LinkedIn/X previews.
- CV button: set `cv: "/your-cv.pdf"` in lib/data.ts (file in /public). It stays hidden until then.
