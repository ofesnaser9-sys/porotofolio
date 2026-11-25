export function openProject(i: number, source?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent("open-project", { detail: { i, source } }));
}
