import type { ReactNode } from "react";

/**
 * Prose — long-form body text container. 65ch measure, calm gray-700 body
 * on ink headings, dash-led lists with the accent as the only color note.
 */
export function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`prose-flow ${className}`.trim()}>{children}</div>;
}
