"use client";
/* eslint-disable react-hooks/immutability -- three.js uniforms are mutated every frame by design; this never triggers React renders. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { EVENTS } from "@/lib/events";
import { seededRandom } from "@/lib/utils";

/*
 * The hero's "signal field": a grid of points shaped like a live metrics
 * surface. The visitor's cursor raises a spike (an anomaly, in the language of
 * my observability pipeline). Everything runs on the GPU in one draw call.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uStrength;
  uniform float uAnomaly;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vHeight;
  varying float vSpike;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35;
    float h = sin(p.x * 0.6 + t * 1.3) * 0.22
            + sin(p.z * 0.9 - t) * 0.18
            + sin((p.x + p.z) * 0.35 + t * 0.7) * 0.25;

    float d = distance(p.xz, uPointer);
    float spike = exp(-d * d * 1.8) * uStrength;
    float anomaly = uAnomaly * step(0.982, aRand) * (1.0 + 0.5 * sin(uTime * 9.0 + aRand * 60.0));

    p.y = h + spike * 1.5 + anomaly * 2.2;
    vHeight = h;
    vSpike = clamp(spike + anomaly, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.2 + vSpike * 3.5) * uPixelRatio * (7.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uBase;
  varying float vHeight;
  varying float vSpike;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float edge = smoothstep(0.5, 0.15, r);
    float mixAmt = clamp(vSpike * 1.3 + (vHeight + 0.45) * 0.25, 0.0, 1.0);
    vec3 col = mix(uBase, uAccent, mixAmt);
    gl_FragColor = vec4(col, edge * (0.38 + vSpike * 0.7 + (vHeight + 0.5) * 0.22));
  }
`;

function readColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

function Field({ cols, rows }: { cols: number; rows: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { camera, gl } = useThree();
  const pointerNdc = useRef(new THREE.Vector2(0, 0));
  const pointerActive = useRef(0);
  const anomaly = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);

  const geometry = useMemo(() => {
    const width = 16;
    const depth = 8;
    const positions = new Float32Array(cols * rows * 3);
    const rand = new Float32Array(cols * rows);
    const random = seededRandom("field");
    let i = 0;
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < cols; x++) {
        positions[i * 3] = (x / (cols - 1) - 0.5) * width;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (rows - 1) - 0.5) * depth;
        rand[i] = random();
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [cols, rows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(3, 0) },
      uStrength: { value: 0 },
      uAnomaly: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
      uAccent: { value: readColor("--accent", "#2f3be8") },
      uBase: { value: readColor("--muted", "#4d546b") },
    }),
    [],
  );

  // Track the pointer over the whole window, relative to the canvas.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      pointerNdc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
      pointerActive.current = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
    };
    const onAnomaly = () => (anomaly.current = 1);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener(EVENTS.anomaly, onAnomaly);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(EVENTS.anomaly, onAnomaly);
    };
  }, [gl]);

  // Re-read the palette when the theme changes.
  useEffect(() => {
    const mo = new MutationObserver(() => {
      const u = material.current?.uniforms;
      if (!u) return;
      u.uAccent.value = readColor("--accent", "#2f3be8");
      u.uBase.value = readColor("--muted", "#4d546b");
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // Uniforms are mutated through the material ref every frame (no React renders).
  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    raycaster.setFromCamera(pointerNdc.current, camera);
    if (raycaster.ray.intersectPlane(plane, target)) {
      const p = u.uPointer.value as THREE.Vector2;
      p.x += (target.x - p.x) * 0.08;
      p.y += (target.z - p.y) * 0.08;
    }
    u.uStrength.value += (pointerActive.current * 0.9 - u.uStrength.value) * 0.05;
    anomaly.current = Math.max(0, anomaly.current - delta * 0.22);
    u.uAnomaly.value = anomaly.current;
    // A slow drift so the field breathes even when nobody touches it.
    state.camera.position.x = Math.sin(u.uTime.value * 0.08) * 0.4;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroField({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const wide = typeof window !== "undefined" && window.innerWidth >= 1280;

  // Stop rendering when the hero is off screen.
  useEffect(() => {
    if (!wrap.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 3.1, 6.4], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        aria-hidden
        onCreated={() => requestAnimationFrame(() => onReady?.())}
      >
        <Field cols={wide ? 150 : 110} rows={wide ? 70 : 54} />
      </Canvas>
    </div>
  );
}
