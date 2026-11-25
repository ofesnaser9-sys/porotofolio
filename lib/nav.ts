// Scene navigation: every in-page jump goes through here so long jumps get the cinematic wipe.
export function goTo(id: string) {
  window.dispatchEvent(new CustomEvent("scene-go", { detail: id }));
}

export const sceneNames: Record<string, string> = {
  top: "Intro",
  about: "About",
  services: "Services",
  work: "Work",
  process: "Process",
  skills: "Skills",
  contact: "Contact",
};

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
