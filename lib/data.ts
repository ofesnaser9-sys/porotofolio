// All portfolio content lives here. English only.

export const profile = {
  name: "Yosef Naser",
  firstName: "Yosef",
  initials: "YN",
  role: "Frontend Developer",
  location: "Sohag, Egypt",
  city: "Sohag",
  email: "ofesnaser9@gmail.com",
  phone: "01030778494",
  whatsapp: "https://wa.me/201030778494",
  photo: "/me.jpg", // put your photo in /public/me.jpg
  cv: "" as string, // e.g. "/Yosef-Naser-CV.pdf" (put the file in /public). The CV button appears only when this is set.
  available: true,
  intro:
    "I design and build fast, polished interfaces with React and Next.js, from the first pixel to the final deploy.",
  about:
    "I'm Yosef, a frontend developer from Sohag, Egypt. I turn designs into interfaces that feel effortless: clean layouts, smooth motion, dark and light themes, and full multilingual support when a product needs it.",
  // Replace the links below with your real profiles.
  socials: [
    { label: "GitHub", icon: "github", href: "https://github.com/" },
    { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/yosef-naser-06ab90353" },
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/ofes._.naser" },
  ] as { label: string; icon: "github" | "linkedin" | "instagram"; href: string }[],
};

export const roles = [
  "Frontend Developer",
  "React & Next.js Engineer",
  "UI Craftsman",
  "Motion & Detail Nerd",
];

export const marquee = [
  "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3",
  "Framer Motion", "Responsive Design", "Dark Mode", "RTL & i18n",
  "Accessibility", "Performance",
];

export const stats = [
  { value: 6, suffix: "", label: "Projects shipped" },
  { value: 12, suffix: "+", label: "Technologies used" },
  { value: 2, suffix: "", label: "Themes per project" },
  { value: 100, suffix: "%", label: "Responsive layouts" },
];

export const services = [
  {
    icon: "layout",
    title: "Websites & Landing Pages",
    text: "Fast, SEO-friendly marketing sites that look sharp on every screen and turn visitors into customers.",
  },
  {
    icon: "code",
    title: "React & Next.js Apps",
    text: "Component-driven applications with clean architecture, typed code and smooth client-side experience.",
  },
  {
    icon: "globe",
    title: "Multilingual & RTL UI",
    text: "Arabic and English interfaces with proper direction, typography and language switching built in.",
  },
  {
    icon: "zap",
    title: "Motion & Polish",
    text: "Subtle animation, dark/light themes and micro-interactions that make a product feel premium.",
  },
];

export const process = [
  { n: "01", title: "Discover", text: "Understand the goal, the audience and the constraints before touching code." },
  { n: "02", title: "Design", text: "Shape layout, colour and type into a clear system that scales." },
  { n: "03", title: "Build", text: "Write clean, typed, responsive components with motion where it helps." },
  { n: "04", title: "Ship", text: "Test, optimise and deploy, then iterate from real feedback." },
];

export const skills = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"] },
  { group: "Motion & UI", items: ["Framer Motion", "Responsive design", "Dark / Light themes", "RTL support", "Accessibility"] },
  { group: "Tools", items: ["Git", "GitHub", "VS Code", "Figma", "Vercel"] },
];

export type Project = {
  title: string;
  category: string;
  role: string;
  description: string;
  highlights: string[];
  tags: string[];
  brand: string;
  live?: string;
  code?: string;
  image?: string; // e.g. "/projects/osytrade.png"
  featured?: boolean;
  layout: "split" | "center";
  pv: {
    logo: string;
    headline: string;
    bg: string;
    ink: string;
    accent: string;
    nav: string;
    navInk: string;
    img?: string;
  };
};

export const projects: Project[] = [
  {
    title: "OSYTRADE",
    category: "Marketplace",
    role: "Design & Frontend",
    featured: true,
    live: "https://osy-trade.vercel.app/",
    description:
      "A premium marketplace for tools and equipment with a crimson dark-first identity, sidebar navigation and live chat.",
    highlights: ["Arabic / English switching", "Dark and light themes", "Sidebar navigation & chat widget"],
    tags: ["Next.js", "Bilingual", "Marketplace UI"],
    brand: "#f0294f",
    layout: "split",
    pv: {
      logo: "OSYTRADE",
      headline: "Trade Tools. Trade Green.",
      bg: "radial-gradient(circle at 75% 40%, #5a1428, #0a0306 62%)",
      ink: "#ffffff",
      accent: "#e11d48",
      nav: "transparent",
      navInk: "#ffffff",
      img: "radial-gradient(circle at 50% 50%, #e8506f66, #2a0a14 72%)",
    },
  },
  {
    title: "Grand Egyptian Museum",
    category: "Culture",
    role: "Design & Frontend",
    description:
      "A landing page for the Grand Egyptian Museum with a full-width hero and a photo gallery that showcases the artifacts.",
    highlights: ["Full-bleed hero image", "Artifact photo gallery", "Clear call to action"],
    tags: ["Landing page", "Gallery", "Hero"],
    brand: "#1f55d6",
    layout: "center",
    pv: {
      logo: "Grand Egyptian Museum",
      headline: "Grand Egyptian Museum",
      bg: "linear-gradient(115deg, #d8be93 0 46%, #0a3fc4 46%)",
      ink: "#ffffff",
      accent: "#f08a2c",
      nav: "#b9b1b1",
      navInk: "#111111",
    },
  },
  {
    title: "Grandoria",
    category: "Hospitality",
    role: "Design & Frontend",
    description:
      "A calm hotel website with a green identity, a striking hero image, booking actions and a row of key numbers.",
    highlights: ["Booking calls to action", "Key numbers strip", "Rounded hero imagery"],
    tags: ["Hotel", "Booking CTA", "Responsive"],
    brand: "#2f8f7a",
    layout: "split",
    pv: {
      logo: "Grandoria",
      headline: "Luxury Redefined in Every Stay",
      bg: "#ffffff",
      ink: "#111111",
      accent: "#0b5557",
      nav: "#44705f",
      navInk: "#ffffff",
      img: "linear-gradient(160deg, #a8dbe8, #2f7f78 62%, #cfe6d8)",
    },
  },
  {
    title: "WE School",
    category: "Education",
    role: "Design & Frontend",
    description:
      "A website for WE School, one of Egypt's applied-technology schools, with a clear story section and a bright purple identity.",
    highlights: ["Brand-matched purple palette", "Story + image layout", "Read-more call to action"],
    tags: ["Education", "Landing page", "Brand colours"],
    brand: "#a64cf6",
    layout: "split",
    pv: {
      logo: "we school",
      headline: "we school",
      bg: "#ffffff",
      ink: "#111111",
      accent: "#a64cf6",
      nav: "#ffffff",
      navInk: "#444444",
      img: "linear-gradient(135deg, #e3d0f8, #9b5de5)",
    },
  },
  {
    title: "Nexa",
    category: "Business",
    role: "Design & Frontend",
    description:
      "A dark, high-contrast landing page for a business-solutions brand: bold headline, short pitch and two clear actions.",
    highlights: ["High-contrast dark UI", "Bold typographic hero", "Primary + secondary actions"],
    tags: ["Dark UI", "Landing page", "Typography"],
    brand: "#10b36b",
    layout: "center",
    pv: {
      logo: "Nexa",
      headline: "innovative business solutions for tomorrow",
      bg: "#000000",
      ink: "#ffffff",
      accent: "#0b8457",
      nav: "transparent",
      navInk: "#ffffff",
    },
  },
  {
    title: "Mamba",
    category: "Training",
    role: "Design & Frontend",
    description:
      "A moody training-centre landing page with a geometric dark background and a magenta call to action.",
    highlights: ["Geometric dark background", "Magenta accent buttons", "Centered hero message"],
    tags: ["Dark UI", "Hero background", "Landing page"],
    brand: "#d12bb4",
    layout: "center",
    pv: {
      logo: "feildtraning",
      headline: "welcome to Mamba",
      bg: "linear-gradient(135deg, #050505, #19191b 60%, #2c2c2f)",
      ink: "#ffffff",
      accent: "#c026a6",
      nav: "transparent",
      navInk: "#ffffff",
    },
  },
];
