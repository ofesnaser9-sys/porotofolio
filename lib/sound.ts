// Optional, off by default. Tiny WebAudio blips: no audio files, no network.
let ctx: AudioContext | null = null;
let enabled = false;
let last = 0;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, vol: number, type: OscillatorType = "sine", slideTo?: number) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sound = {
  get on() { return enabled; },
  init() {
    try { enabled = localStorage.getItem("sound") === "1"; } catch (e) {}
    return enabled;
  },
  set(v: boolean) {
    enabled = v;
    try { localStorage.setItem("sound", v ? "1" : "0"); } catch (e) {}
    if (v) { blip(660, 0.12, 0.05); setTimeout(() => blip(990, 0.16, 0.05), 90); }
  },
  tick() {
    if (!enabled) return;
    const n = performance.now();
    if (n - last < 70) return;
    last = n;
    blip(1900, 0.035, 0.018, "sine");
  },
  click() { if (enabled) blip(520, 0.09, 0.04, "triangle", 300); },
  whoosh() { if (enabled) blip(180, 0.5, 0.035, "sawtooth", 900); },
  found() {
    if (!enabled) return;
    blip(784, 0.14, 0.05);
    setTimeout(() => blip(1175, 0.22, 0.05), 110);
  },
};
