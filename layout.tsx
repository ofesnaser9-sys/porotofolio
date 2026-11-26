import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Bricolage_Grotesque, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import Loader from "../components/Loader";
import Cursor from "../components/Cursor";
import Toast from "../components/Toast";
import Dock from "../components/Dock";
import FX from "../components/FX";
import SceneBackground from "../components/SceneBackground";
import Scene3D from "../components/Scene3D";
import SceneWipe from "../components/SceneWipe";
import Providers from "../components/Providers";
import "./globals.css";

const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-var", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "OFES NASER | Frontend Developer",
  description: "Portfolio of Yosef Naser, a frontend developer building fast, polished web experiences with React and Next.js.",
  openGraph: {
    title: "OFES NASER | Frontend Developer",
    description: "Fast, polished interfaces with React and Next.js.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Yosef Naser" }],
  },
  twitter: { card: "summary_large_image", title: "OFES NASER | Frontend Developer", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  colorScheme: "dark light",
};

// Runs before paint: theme, a "js" flag (so intro states only apply when scripts run) and a safety net
// that reveals the page even if the loader never finishes.
const initScript = `try{var d=document.documentElement;d.classList.add('js');var m=matchMedia;if(m('(max-width: 820px)').matches||m('(hover: none)').matches||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4)d.classList.add('lite');d.dataset.theme=localStorage.getItem('theme')||'dark';setTimeout(function(){d.dataset.ready='1'},7000)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${body.variable} ${display.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <Providers>
          <SceneBackground />
          <Scene3D />
          <Loader />
          <Cursor />
          <Toast />
          <Dock />
          <FX />
          <SceneWipe />
          {children}
        </Providers>
      </body>
    </html>
  );
}
