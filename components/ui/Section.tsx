import type { ReactNode } from "react";

/**
 * Section — vertical rhythm unit. Extreme negative space is the default:
 * sections breathe at 7rem/11rem, so content blocks read as deliberate
 * editorial gestures rather than stacked cards.
 */
export function Section({
  children,
  id,
  className = "",
  /** Set false to opt out of the default vertical rhythm. */
  spaced = true,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  spaced?: boolean;
}) {
  const rhythm = spaced ? "py-28 md:py-44" : "";
  return (
    <section id={id} className={`${rhythm} ${className}`.trim()}>
      {children}
    </section>
  );
}
