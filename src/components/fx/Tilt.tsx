"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function TiltInner({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const background = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(420px circle at ${gx} ${gy}, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)`,
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={cn("group [perspective:1000px]", className)}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background }}
          />
        )}
      </motion.div>
    </div>
  );
}

const FINE = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * 3D tilt toward the pointer with a moving highlight. Mouse only: on touch
 * screens it renders a plain wrapper, so phones skip the animation hooks.
 */
export function Tilt(props: { children: ReactNode; className?: string; max?: number }) {
  const fine = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FINE).matches,
    () => false,
  );
  if (!fine) return <div className={cn("group", props.className)}>{props.children}</div>;
  return <TiltInner {...props} />;
}
