/**
 * HeroVisual — the hero's decorative layer (client wrapper, tiny bundle).
 *
 * Mount-after-paint strategy: the server-rendered static glyph composition
 * (StaticGlyphs) is always in the DOM first — no-JS and first-paint users
 * get a composed image immediately. Only if the user allows motion does
 * the rAF canvas mount (code-split via next/dynamic, ssr: false), and the
 * static layer dissolves underneath it as the live field forms.
 *
 * prefers-reduced-motion: the canvas is never requested at all; the
 * static composition remains, permanently still.
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StaticGlyphs } from "./StaticGlyphs";

const GlyphCanvas = dynamic(() => import("./GlyphCanvas"), { ssr: false });

export function HeroVisual() {
  const [live, setLive] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    // Mount after the first paint so the canvas never contends with LCP;
    // fade the live field in over the dissolving static composition.
    const raf1 = requestAnimationFrame(() => {
      setLive(true);
      const raf2 = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          live ? "opacity-0" : "opacity-100"
        }`}
      >
        <StaticGlyphs />
      </div>
      {live && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          <GlyphCanvas />
        </div>
      )}
    </div>
  );
}
