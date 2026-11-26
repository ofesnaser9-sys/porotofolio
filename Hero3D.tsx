"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, Float } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = "#dc143c";
const GLOW = "#ff7a59"; // refined secondary glow

type Props = { lite: boolean; onReady?: () => void };

// Shared input: smoothed pointer / tilt (-1..1) + scroll progress (0..1 over the page).
const input = { x: 0, y: 0, scroll: 0 };

function Blob({ lite }: { lite: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, invalidate } = useThree();

  useFrame((state, dt) => {
    const g = group.current, m = mesh.current;
    if (!g || !m) return;
    const s = input.scroll;
    const wide = viewport.width / viewport.height > 1.3;
    const a = s * Math.PI * 4;

    // Scroll story: starts top-right of the hero, then glides between the page edges and shrinks.
    const tx = (wide ? 2.6 : 0.75) * Math.cos(a);
    const ty = (wide ? 0.8 : 1.3) * Math.cos(s * Math.PI * 3);
    const ts = (wide ? 1.15 : 0.8) * (1 - 0.4 * Math.min(1, s * 6));
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 3, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, ts, 3, dt));

    // Mouse / tilt / touch + scroll rotation, smooth damping.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, input.x * 0.7 + s * Math.PI * 6, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -input.y * 0.5 + s * 1.5, 4, dt);

    // Morph: the surface gets wilder as you scroll.
    const mat = m.material as any;
    mat.distort = THREE.MathUtils.damp(mat.distort, 0.32 + Math.min(0.3, s * 0.9), 2, dt);
    mat.speed = 1.2 + s * 2;
    m.rotation.z = state.clock.elapsedTime * 0.08;
    invalidate(); // demand loop: keeps going while mounted, and stops when the tab is hidden
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.8}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.35, lite ? 24 : 64]} />
          <MeshDistortMaterial color={ACCENT} roughness={0.12} metalness={0.85} envMapIntensity={1.4} distort={0.35} speed={1.4} />
        </mesh>
      </Float>
    </group>
  );
}

// Studio softboxes generated on the GPU: no HDR download, so it is fast and works offline.
function Studio({ lite }: { lite: boolean }) {
  return (
    <Environment resolution={lite ? 128 : 256} frames={1}>
      <color attach="background" args={["#000000"]} />
      <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[12, 3, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.5} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color={GLOW} />
      <Lightformer form="ring" intensity={3} position={[5, 2, 3]} scale={3} color="#ffffff" />
      <Lightformer form="circle" intensity={1.5} position={[0, -4, 4]} scale={4} color={ACCENT} />
    </Environment>
  );
}

// Stops rendering completely while the tab is hidden.
function Visibility() {
  const { invalidate, setFrameloop } = useThree();
  useEffect(() => {
    const on = () => {
      setFrameloop(document.hidden ? "never" : "demand");
      if (!document.hidden) invalidate();
    };
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, [invalidate, setFrameloop]);
  return null;
}

export default function Hero3D({ lite, onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const ready = useRef(false);

  useEffect(() => {
    let tx = 0, ty = 0, raf = 0, appear = 0;
    const move = (e: PointerEvent) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      input.x += (tx - input.x) * 0.06;
      input.y += (ty - input.y) * 0.06;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      input.scroll = Math.min(1, Math.max(0, scrollY / max));
      // fade in once the GPU is ready, then dim after the hero so text stays readable
      if (ready.current) appear += (1 - appear) * 0.05;
      const dim = 1 - 0.55 * Math.min(1, scrollY / (innerHeight * 0.9));
      if (wrap.current) wrap.current.style.opacity = (appear * dim).toFixed(3);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("deviceorientation", tilt, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, []);

  return (
    <div ref={wrap} style={{ position: "absolute", inset: 0, opacity: 0 }}>
      <Canvas
        frameloop="demand"
        dpr={lite ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => { ready.current = true; onReady?.(); }}
      >
        <Studio lite={lite} />
        <pointLight position={[-4, 2, 3]} intensity={18} color={GLOW} />
        <pointLight position={[4, -2, 2]} intensity={10} color={ACCENT} />
        <Blob lite={lite} />
        <Visibility />
      </Canvas>
    </div>
  );
}
