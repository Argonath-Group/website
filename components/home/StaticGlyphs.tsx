/**
 * StaticGlyphs — the hero's no-JS / reduced-motion / first-paint
 * composition. Pure markup, deterministic positions, zero motion.
 * Also rendered underneath the live canvas as it fades in.
 */
const CLAMP = "clamp(2rem, 5vw, 4.5rem)";

const GLYPHS: Array<{
  x: number; // % from left
  y: number; // % from top
  ch: string;
  scale: number;
  rotate: number;
  accent?: boolean;
}> = [
  { x: 4, y: 10, ch: "A", scale: 1.6, rotate: -6 },
  { x: 88, y: 8, ch: "/", scale: 1.2, rotate: 12 },
  { x: 76, y: 22, ch: "·", scale: 2, rotate: 0, accent: true },
  { x: 94, y: 38, ch: "T", scale: 1, rotate: 8 },
  { x: 10, y: 78, ch: ":", scale: 1.4, rotate: -10 },
  { x: 84, y: 72, ch: "H", scale: 1.8, rotate: 4 },
  { x: 68, y: 88, ch: "—", scale: 1.1, rotate: -14 },
  { x: 24, y: 92, ch: "*", scale: 1, rotate: 10 },
  { x: 46, y: 6, ch: "G", scale: 0.9, rotate: -4 },
  { x: 60, y: 48, ch: "\\", scale: 1.3, rotate: 18 },
  { x: 34, y: 62, ch: "|", scale: 1, rotate: 0 },
  { x: 97, y: 88, ch: "N", scale: 1.1, rotate: -8 },
];

export function StaticGlyphs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className={`absolute font-mono leading-none ${
            g.accent ? "text-accent" : "text-gray-300"
          }`}
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            fontSize: `calc(${CLAMP} * ${g.scale})`,
            transform: `rotate(${g.rotate}deg)`,
          }}
        >
          {g.ch}
        </span>
      ))}
    </div>
  );
}
