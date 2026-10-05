import { useMemo } from "react";

/**
 * "Sunlight through leaves": soft, blurred botanical shadows over a color
 * field, as on the new boxes. Pure SVG, so it recolors per section and costs
 * no image downloads. Each layer is blurred once and only its transform is
 * animated, which keeps the sway on the GPU.
 */

interface LeafShadowProps {
  /** Shadow color (any CSS color). Use a dark tone at low opacity. */
  color?: string;
  /** 0–1 overall strength. */
  opacity?: number;
  /** Changes the branch layout. */
  seed?: number;
  /** Blur radius in px; larger reads softer and further away. */
  blur?: number;
  /** Adds a warm light wash on top (sun through the window). */
  sunlight?: boolean;
  /** Static shadow (no sway), e.g. on small cards. */
  still?: boolean;
  className?: string;
}

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Leaf outline pointing along +x, length 1, width ~0.38. */
const LEAF = "M0 0 C0.22 -0.24 0.68 -0.22 1 0 C0.68 0.22 0.22 0.24 0 0 Z";

interface Leaf {
  x: number;
  y: number;
  angle: number;
  size: number;
}

interface Branch {
  path: string;
  leaves: Leaf[];
}

function buildBranches(seed: number, count: number): Branch[] {
  const rand = mulberry32(seed);
  const branches: Branch[] = [];
  for (let b = 0; b < count; b++) {
    // Start off-canvas on the top or a side edge and grow inward.
    const fromTop = rand() > 0.35;
    let x = fromTop ? rand() * 1000 : rand() > 0.5 ? -40 : 1040;
    let y = fromTop ? -40 : rand() * 500;
    let angle = fromTop ? 70 + rand() * 40 : x < 0 ? 15 + rand() * 40 : 125 + rand() * 40;
    const steps = 7 + Math.floor(rand() * 6);
    const step = 55 + rand() * 30;
    const points: [number, number][] = [[x, y]];
    const leaves: Leaf[] = [];
    for (let i = 0; i < steps; i++) {
      angle += (rand() - 0.5) * 22;
      const rad = (angle * Math.PI) / 180;
      x += Math.cos(rad) * step;
      y += Math.sin(rad) * step;
      points.push([x, y]);
      const side = i % 2 === 0 ? 1 : -1;
      const size = 70 + rand() * 70 - i * 2;
      leaves.push({ x, y, angle: angle + side * (35 + rand() * 25), size });
      if (rand() > 0.55) {
        leaves.push({ x, y, angle: angle - side * (30 + rand() * 30), size: size * 0.8 });
      }
    }
    const path = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
    branches.push({ path, leaves });
  }
  return branches;
}

const Layer = ({
  branches,
  color,
  blur,
  duration,
  still,
  offset,
}: {
  branches: Branch[];
  color: string;
  blur: number;
  duration: number;
  still?: boolean;
  offset: string;
}) => (
  <div
    className={`absolute -inset-[6%] ${still ? "" : "leaf-sway"}`}
    style={{ ["--sway-duration" as string]: `${duration}s`, animationDelay: offset }}
  >
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      style={{ filter: `blur(${blur}px)` }}
      aria-hidden="true"
    >
      <g fill={color} stroke={color}>
        {branches.map((b, i) => (
          <g key={i}>
            <path d={b.path} fill="none" strokeWidth={5} strokeLinecap="round" />
            {b.leaves.map((l, j) => (
              <path
                key={j}
                d={LEAF}
                stroke="none"
                transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)}) scale(${l.size.toFixed(1)})`}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  </div>
);

const LeafShadow = ({
  color = "rgba(20, 10, 12, 1)",
  opacity = 0.18,
  seed = 7,
  blur = 14,
  sunlight = true,
  still = false,
  className = "",
}: LeafShadowProps) => {
  const near = useMemo(() => buildBranches(seed, 4), [seed]);
  const far = useMemo(() => buildBranches(seed + 101, 3), [seed]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ opacity }}>
        <Layer branches={far} color={color} blur={blur * 1.9} duration={19} still={still} offset="-6s" />
        <Layer branches={near} color={color} blur={blur} duration={13} still={still} offset="0s" />
      </div>
      {sunlight && (
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 50% at 75% 20%, rgba(255,236,200,0.9), transparent 70%), radial-gradient(40% 40% at 15% 85%, rgba(255,240,215,0.5), transparent 70%)",
          }}
        />
      )}
    </div>
  );
};

export default LeafShadow;
