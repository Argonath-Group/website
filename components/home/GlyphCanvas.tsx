"use client";

import { useEffect, useRef } from "react";

/**
 * GlyphCanvas — 2D-canvas kinetic typography for the hero.
 *
 * A dispersed field of mono glyphs that drifts on a spring back to home
 * positions and scatters away from the pointer. 2D context only (no
 * WebGL); count scales with viewport area; the loop pauses offscreen and
 * when the tab is hidden; listeners are passive. Never mounts under
 * prefers-reduced-motion (see HeroVisual) and touches nothing the LCP
 * element (the headline) needs.
 */

const CHARS = "AARGONTH·—:/\\|+*".split("");

interface Glyph {
  x: number;
  y: number;
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  ch: string;
  size: number;
  alpha: number;
  accent: boolean;
  phase: number;
}

const MAX_SPEED = 3;
const POINTER_RADIUS = 130;
const ACCENT_SHARE = 0.08;

function buildGlyphs(width: number, height: number): Glyph[] {
  const count = Math.max(36, Math.min(120, Math.round((width * height) / 12000)));
  const glyphs: Glyph[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    glyphs.push({
      x,
      y,
      hx: x,
      hy: y,
      vx: 0,
      vy: 0,
      ch: CHARS[(Math.random() * CHARS.length) | 0],
      size: 14 + Math.random() * 30,
      alpha: 0.08 + Math.random() * 0.22,
      accent: Math.random() < ACCENT_SHARE,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return glyphs;
}

export default function GlyphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let glyphs: Glyph[] = [];
    let width = 0;
    let height = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      glyphs = buildGlyphs(width, height);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) onPointerLeave();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || width === 0) return;

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const g of glyphs) {
        /* Spring home + gentle wander. */
        g.vx += (g.hx - g.x) * 0.015;
        g.vy += (g.hy - g.y) * 0.015;
        g.vx += Math.cos(t * 0.0004 + g.phase) * 0.02;
        g.vy += Math.sin(t * 0.0005 + g.phase) * 0.02;

        /* Pointer repulsion. */
        const dx = g.x - pointer.x;
        const dy = g.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < POINTER_RADIUS * POINTER_RADIUS && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / POINTER_RADIUS) * 1.4;
          g.vx += (dx / d) * f;
          g.vy += (dy / d) * f;
        }

        /* Damping + speed cap. */
        g.vx *= 0.92;
        g.vy *= 0.92;
        const speed = Math.hypot(g.vx, g.vy);
        if (speed > MAX_SPEED) {
          g.vx = (g.vx / speed) * MAX_SPEED;
          g.vy = (g.vy / speed) * MAX_SPEED;
        }
        g.x += g.vx;
        g.y += g.vy;

        ctx.font = `${g.size}px "IBM Plex Mono", ui-monospace, monospace`;
        ctx.fillStyle = g.accent
          ? `rgba(26, 58, 255, ${Math.min(g.alpha + 0.15, 0.6)})`
          : `rgba(20, 20, 18, ${g.alpha})`;
        ctx.fillText(g.ch, g.x, g.y);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
