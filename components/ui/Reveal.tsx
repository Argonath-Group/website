"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Reveal — scroll-reveal wrapper (D-002: CSS/IO only, no animation lib).
 *
 * Contract:
 *  - Content is ALWAYS visible by default (SSR markup, no-JS, and
 *    prefers-reduced-motion users see everything immediately).
 *  - Only after mount, if the user allows motion, the element is "armed"
 *    (opacity 0 + offset) and an IntersectionObserver flips it to
 *    "reveal-in" when it enters the viewport.
 *  - `delay` staggers siblings in ms (orchestrated page loads).
 */
export function Reveal({
  children,
  className = "",
  /** Stagger delay in milliseconds. */
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return; // never arm — content stays visible

    el.classList.add("reveal-armed");
    el.style.transitionDelay = `${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
