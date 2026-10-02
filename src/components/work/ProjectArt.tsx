import type { ArtVariant } from "@/data/projects";
import { cn, seededRandom } from "@/lib/utils";

/*
 * Generated covers, one visual language per kind of system. Seeded by the
 * project slug so each card is unique but stable between renders. Elements
 * with `group-hover:` classes animate when the parent card is hovered.
 * To use a real screenshot instead, set `cover` on the project.
 */

const W = 400;
const H = 260;

export function ProjectArt({
  variant,
  seed,
  className,
}: {
  variant: ArtVariant;
  seed: string;
  className?: string;
}) {
  const rand = seededRandom(seed);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      // The dotted backdrop is CSS so it fills any card shape; the art itself is never cropped.
      className={cn(
        "size-full bg-[radial-gradient(var(--line)_1px,transparent_1.2px)] bg-[size:12px_12px] p-4",
        className,
      )}
      aria-hidden
    >
      {variant === "pipeline" && <Pipeline rand={rand} />}
      {variant === "agents" && <Agents rand={rand} />}
      {variant === "grid" && <Grid rand={rand} />}
      {variant === "scan" && <Scan />}
      {variant === "wave" && <Wave rand={rand} />}
      {variant === "layers" && <Layers />}
      {variant === "kernel" && <Kernel />}
      {variant === "gauge" && <Gauge rand={rand} />}
      {variant === "stages" && <Stages />}
    </svg>
  );
}

type R = { rand: () => number };

const ease = "transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]";

function Pipeline({ rand }: R) {
  const stages = [50, 150, 250, 350];
  // A metric series with one anomaly, drawn above the stages.
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = 20 + i * 9.2;
    const spike = i === 27 ? -46 : 0;
    return `${x.toFixed(1)},${(78 + Math.sin(i * 0.7) * 8 + (rand() - 0.5) * 10 + spike).toFixed(1)}`;
  });
  return (
    <g>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.4"
        opacity="0.6"
      />
      <circle
        cx={20 + 27 * 9.2}
        cy="32"
        r="5"
        fill="var(--accent)"
        className={cn(ease, "origin-[268px_32px] group-hover:scale-150")}
      />
      <line x1="40" y1="170" x2="360" y2="170" stroke="var(--line)" strokeWidth="2" />
      {stages.map((x, i) => (
        <g key={x}>
          <rect
            x={x - 30}
            y="146"
            width="60"
            height="48"
            rx="10"
            fill="var(--surface)"
            stroke={i === 2 ? "var(--accent)" : "var(--ink)"}
            strokeWidth="1.5"
          />
          <rect
            x={x - 18}
            y="164"
            width={14 + rand() * 22}
            height="4"
            rx="2"
            fill="var(--muted)"
            opacity="0.6"
          />
          <rect
            x={x - 18}
            y="173"
            width={10 + rand() * 16}
            height="4"
            rx="2"
            fill="var(--muted)"
            opacity="0.35"
          />
        </g>
      ))}
      {/* Messages in flight between stages. */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={88 + i * 100}
          cy="170"
          r="3.5"
          fill="var(--accent)"
          className={cn(ease, "group-hover:translate-x-6")}
          style={{ transitionDelay: `${i * 80}ms` }}
        />
      ))}
      <rect
        x="220"
        y="214"
        width="60"
        height="22"
        rx="6"
        fill="none"
        stroke="var(--muted)"
        strokeDasharray="3 3"
        opacity="0.7"
      />
      <line
        x1="250"
        y1="194"
        x2="250"
        y2="214"
        stroke="var(--muted)"
        strokeDasharray="3 3"
        opacity="0.7"
      />
    </g>
  );
}

function Agents({ rand }: R) {
  const n = 6;
  const cx = 200;
  const cy = 130;
  const r = 82;
  const start = rand() * Math.PI;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = start + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r * 1.35, y: cy + Math.sin(a) * r };
  });
  return (
    <g>
      {nodes.map((p, i) => {
        const q = nodes[(i + 2) % n];
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="var(--ink)"
              strokeWidth="1.2"
              opacity="0.35"
            />
            <line
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="var(--accent)"
              strokeWidth="1.2"
              strokeDasharray="4 5"
              className={cn(ease, "opacity-20 group-hover:opacity-80")}
            />
          </g>
        );
      })}
      {nodes.map((p, i) => (
        <g key={`n${i}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r="17"
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <circle cx={p.x} cy={p.y} r="4" fill={i % 3 === 0 ? "var(--accent)" : "var(--muted)"} />
        </g>
      ))}
      <circle
        cx={cx}
        cy={cy}
        r="28"
        fill="var(--accent)"
        className={cn(ease, "origin-[200px_130px] group-hover:scale-110")}
      />
      <path
        d={`M${cx - 9} ${cy} l6 6 l12 -13`}
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Grid({ rand }: R) {
  const cells = Array.from({ length: 6 }, (_, i) => ({
    x: 70 + (i % 3) * 92,
    y: 70 + Math.floor(i / 3) * 84,
    h: 30 + rand() * 30,
  }));
  return (
    <g>
      <rect
        x="40"
        y="28"
        width="320"
        height="214"
        rx="14"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <rect x="56" y="42" width="140" height="12" rx="6" fill="var(--surface-2)" />
      <circle cx="342" cy="48" r="5" fill="var(--accent)" />
      {cells.map((c, i) => (
        <g key={i} className={cn(ease, i === 4 ? "group-hover:-translate-y-2" : "")}>
          <rect
            x={c.x}
            y={c.y}
            width="80"
            height="72"
            rx="9"
            fill={i === 4 ? "var(--accent)" : "var(--bg)"}
            stroke={i === 4 ? "var(--accent)" : "var(--line)"}
          />
          <rect
            x={c.x + 10}
            y={c.y + 72 - c.h * 0.6}
            width="12"
            height={c.h * 0.6 - 10}
            rx="3"
            fill={i === 4 ? "var(--accent-ink)" : "var(--muted)"}
            opacity="0.55"
          />
          <rect
            x={c.x + 28}
            y={c.y + 72 - c.h * 0.9}
            width="12"
            height={c.h * 0.9 - 10}
            rx="3"
            fill={i === 4 ? "var(--accent-ink)" : "var(--muted)"}
            opacity="0.35"
          />
          <rect
            x={c.x + 46}
            y={c.y + 14}
            width="24"
            height="5"
            rx="2.5"
            fill={i === 4 ? "var(--accent-ink)" : "var(--muted)"}
            opacity="0.5"
          />
        </g>
      ))}
    </g>
  );
}

function Scan() {
  // Two fingertips back to back; the diamond-shaped gap between them is the signal.
  return (
    <g>
      <path
        d="M40 72 H170 C196 72 200 96 196 118 L188 130 L196 142 C200 164 196 188 170 188 H40"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M360 72 H230 C204 72 200 96 204 118 L212 130 L204 142 C200 164 204 188 230 188 H360"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.5"
      />
      <path
        d="M200 104 L212 130 L200 156 L188 130 Z"
        fill="var(--accent)"
        className={cn(ease, "origin-[200px_130px] group-hover:scale-125")}
      />
      {/* Scan line */}
      <rect
        x="40"
        y="70"
        width="320"
        height="2"
        fill="var(--accent)"
        opacity="0.6"
        className={cn(
          "transition-transform duration-[1400ms] ease-in-out group-hover:translate-y-[118px]",
        )}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={70 + i * 56}
          y="220"
          width="44"
          height="8"
          rx="4"
          fill={i === 3 ? "var(--accent)" : "var(--surface-2)"}
        />
      ))}
    </g>
  );
}

function Wave({ rand }: R) {
  const lines = Array.from({ length: 7 }, (_, j) => {
    const phase = rand() * Math.PI * 2;
    const amp = 10 + rand() * 18;
    const pts = Array.from({ length: 60 }, (_, i) => {
      const x = (i / 59) * W;
      const y = 60 + j * 24 + Math.sin(i * 0.22 + phase) * amp * Math.sin((i / 59) * Math.PI);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return pts.join(" ");
  });
  return (
    <g>
      {lines.map((pts, j) => (
        <polyline
          key={j}
          points={pts}
          fill="none"
          stroke={j === 3 ? "var(--accent)" : "var(--ink)"}
          strokeWidth={j === 3 ? 2.5 : 1}
          opacity={j === 3 ? 1 : 0.25}
          className={j === 3 ? cn(ease, "group-hover:-translate-y-2") : undefined}
        />
      ))}
    </g>
  );
}

/* Razor: four checks in a stack; the third one catches the hijacked purchase. */
function Layers() {
  const rows = ["L1", "L2", "L3", "L4"];
  return (
    <g>
      {rows.map((label, i) => {
        const flagged = i === 2;
        const y = 34 + i * 54;
        return (
          <g key={label} className={flagged ? cn(ease, "group-hover:translate-x-3") : undefined}>
            <rect
              x="110"
              y={y}
              width="220"
              height="42"
              rx="10"
              fill={flagged ? "var(--accent)" : "var(--surface)"}
              stroke={flagged ? "var(--accent)" : "var(--ink)"}
              strokeWidth="1.5"
            />
            <text
              x="130"
              y={y + 27}
              fontSize="15"
              fontWeight="700"
              fill={flagged ? "var(--accent-ink)" : "var(--ink)"}
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
            <rect
              x="170"
              y={y + 17}
              width={flagged ? 100 : 60 + i * 16}
              height="6"
              rx="3"
              fill={flagged ? "var(--accent-ink)" : "var(--muted)"}
              opacity="0.55"
            />
          </g>
        );
      })}
      {/* The cart token travelling down through the layers. */}
      <circle
        cx="70"
        cy="55"
        r="9"
        fill="var(--ink)"
        className={cn(ease, "group-hover:translate-y-[108px]")}
      />
      <line
        x1="70"
        y1="70"
        x2="70"
        y2="210"
        stroke="var(--line)"
        strokeWidth="2"
        strokeDasharray="3 4"
      />
    </g>
  );
}

/* FlashGraph: three separate ops become one fused block. */
function Kernel() {
  const small = [
    { y: 40, t: "Norm" },
    { y: 100, t: "MatMul" },
    { y: 160, t: "GELU" },
  ];
  return (
    <g>
      {small.map((b) => (
        <g key={b.t} className={cn(ease, "group-hover:translate-x-6")}>
          <rect
            x="40"
            y={b.y}
            width="92"
            height="44"
            rx="9"
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth="1.5"
          />
          <text
            x="86"
            y={b.y + 27}
            fontSize="13"
            fontWeight="600"
            textAnchor="middle"
            fill="var(--ink)"
            fontFamily="var(--font-sans)"
          >
            {b.t}
          </text>
          <line
            x1="132"
            y1={b.y + 22}
            x2="208"
            y2="130"
            stroke="var(--muted)"
            strokeWidth="1.2"
            strokeDasharray="3 4"
          />
        </g>
      ))}
      <rect x="208" y="52" width="150" height="156" rx="14" fill="var(--accent)" />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={228 + c * 30}
            y={72 + r * 30}
            width="20"
            height="20"
            rx="4"
            fill="var(--accent-ink)"
            opacity={0.25 + ((r + c) % 3) * 0.2}
          />
        )),
      )}
    </g>
  );
}

/* Battery Guard: a battery capped at a threshold, with a charge curve below. */
function Gauge({ rand }: R) {
  const pts = Array.from({ length: 30 }, (_, i) => {
    const x = 60 + i * 9.4;
    const y = 214 - Math.min(Math.sqrt(i) * 11, 52) + (rand() - 0.5) * 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <g>
      <rect
        x="70"
        y="40"
        width="240"
        height="96"
        rx="16"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <rect x="310" y="72" width="16" height="32" rx="5" fill="var(--ink)" />
      <rect
        x="82"
        y="52"
        width="166"
        height="72"
        rx="9"
        fill="var(--accent)"
        className={cn(ease, "origin-left group-hover:scale-x-[1.1]")}
      />
      <line
        x1="262"
        y1="34"
        x2="262"
        y2="142"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <text
        x="262"
        y="30"
        fontSize="12"
        fontWeight="700"
        textAnchor="middle"
        fill="var(--ink)"
        fontFamily="var(--font-sans)"
      >
        limit
      </text>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.6"
        opacity="0.7"
      />
    </g>
  );
}

/* METIS: six writing stages A to F; the document-grounded stages D to F are highlighted. */
function Stages() {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return (
    <g>
      <line x1="60" y1="130" x2="340" y2="130" stroke="var(--line)" strokeWidth="3" />
      {letters.map((l, i) => {
        const x = 60 + i * 56;
        const hot = i >= 3;
        return (
          <g
            key={l}
            className={hot ? cn(ease, "group-hover:-translate-y-2") : undefined}
            style={hot ? { transitionDelay: `${(i - 3) * 70}ms` } : undefined}
          >
            <circle
              cx={x}
              cy="130"
              r="22"
              fill={hot ? "var(--accent)" : "var(--surface)"}
              stroke={hot ? "var(--accent)" : "var(--ink)"}
              strokeWidth="1.5"
            />
            <text
              x={x}
              y="136"
              fontSize="16"
              fontWeight="700"
              textAnchor="middle"
              fill={hot ? "var(--accent-ink)" : "var(--ink)"}
              fontFamily="var(--font-sans)"
            >
              {l}
            </text>
          </g>
        );
      })}
      <rect x="60" y="60" width="140" height="8" rx="4" fill="var(--muted)" opacity="0.35" />
      <rect x="60" y="76" width="96" height="8" rx="4" fill="var(--muted)" opacity="0.22" />
      <rect x="116" y="186" width="168" height="8" rx="4" fill="var(--accent)" opacity="0.5" />
    </g>
  );
}
