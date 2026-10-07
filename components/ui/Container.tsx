import type { ReactNode } from "react";

/**
 * Container — the single horizontal boundary for all page content.
 * Wide gutter on mobile (edge-to-edge is never used), generous max-width,
 * asymmetric-friendly: pages may break out via negative utilities.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-site px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
