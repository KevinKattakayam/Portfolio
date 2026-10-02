// Generates the static hero dot-field images (public/field-light.svg, field-dark.svg).
// Run `node scripts/generate-field.mjs` if you ever change the look. The images are
// used as the instant first paint; the live WebGL field fades in over them.
import { writeFileSync } from "node:fs";

function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const themes = {
  light: { muted: "#4d546b", accent: "#2f3be8" },
  dark: { muted: "#9ca3bf", accent: "#8e9bff" },
};
const cols = 44;
const rows = 12;

for (const [name, c] of Object.entries(themes)) {
  const rand = seededRandom("signal");
  const calm = [];
  const hot = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const u = i / (cols - 1);
      const depth = j / (rows - 1);
      const spread = 0.55 + depth * 0.45;
      const x = 50 + (u - 0.5) * 100 * spread * 1.15;
      const wave = Math.sin(u * 9 + j * 0.6) * 1.6 + Math.sin(u * 4 - j) * 1.2;
      const d = Math.hypot(u - 0.72, depth - 0.55);
      const spike = Math.exp(-d * d * 40) * 14;
      const y = 30 + depth * 50 - wave - spike;
      const hotness = Math.min(1, spike / 8);
      const r = (0.18 + depth * 0.22 + (rand() > 0.97 ? 0.1 : 0) + hotness * 0.35).toFixed(2);
      const dot = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"${hotness > 0.15 ? ` opacity="${(0.3 + hotness * 0.7).toFixed(2)}"` : ""}/>`;
      (hotness > 0.15 ? hot : calm).push(dot);
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">` +
    `<g fill="${c.muted}" opacity="0.4">${calm.join("")}</g><g fill="${c.accent}">${hot.join("")}</g></svg>`;
  writeFileSync(`public/field-${name}.svg`, svg);
  console.log(name, svg.length, "bytes");
}
