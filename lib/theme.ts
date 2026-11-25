export type Theme = "dark" | "light";

export function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "dark";
}

export function applyTheme(next: Theme, x?: number, y?: number) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    window.dispatchEvent(new Event("themechange"));
  };
  const doc = document as any;
  if (!doc.startViewTransition || x === undefined || y === undefined) return apply();
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = doc.startViewTransition(apply);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message }));
}
