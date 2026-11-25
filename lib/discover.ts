import { toast } from "./theme";
import { sound } from "./sound";

// Hidden details. Each one is found by doing something, not by reading about it.
export const discoveries = [
  { id: "secret", title: "Secret mode", hint: "Type the four letters of my first name anywhere on the page." },
  { id: "badge", title: "Spin-up", hint: "The rotating badge on my portrait is not just decoration. Click it." },
  { id: "lens", title: "Under the surface", hint: "Rest your cursor on my portrait for a moment and look closely." },
  { id: "gem", title: "The small gem", hint: "Something tiny is hiding at the very bottom of the page." },
  { id: "lights", title: "Light show", hint: "Flip between dark and light three times in a row." },
  { id: "konami", title: "Old school", hint: "Up, up, down, down, left, right, left, right, B, A." },
] as const;

export type DiscoveryId = (typeof discoveries)[number]["id"];

const KEY = "discovered";

export function found(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
}

export function unlockDirectors(on: boolean) {
  document.documentElement.classList.toggle("directors", on);
  try { localStorage.setItem("directors", on ? "1" : "0"); } catch (e) {}
  window.dispatchEvent(new Event("discover"));
}

export function directorsUnlocked(): boolean {
  return found().length >= discoveries.length;
}

export function discover(id: DiscoveryId) {
  const list = found();
  if (list.includes(id)) return false;
  list.push(id);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  const d = discoveries.find((x) => x.id === id)!;
  sound.found();
  if (list.length >= discoveries.length) {
    toast("All details found. Director's cut unlocked");
    unlockDirectors(true);
  } else {
    toast(`Found: ${d.title} (${list.length}/${discoveries.length})`);
    window.dispatchEvent(new Event("discover"));
  }
  return true;
}

export function nextHint(): string {
  const list = found();
  const d = discoveries.find((x) => !list.includes(x.id));
  return d ? d.hint : "You found everything. Toggle Director's cut from the command menu.";
}
