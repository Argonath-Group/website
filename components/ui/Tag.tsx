import type { WorkKind, WorkStatus } from "@/content/site";

/**
 * Tag — status/kind label derived from the WorkStatus type (D-006 data).
 *
 *   Live           → accent fill (it's the thing you can touch)
 *   In development → accent outline (real, announced, not shipped — D-023)
 *   Research       → ink outline (deliberate, in-progress)
 *   Experiment     → dashed gray (tentative, lab register)
 *
 * `kind` (Product/Research/Experiment) is prepended when it differs from
 * the status, producing labels like "Product · In development".
 */
const VARIANTS: Record<
  WorkStatus,
  { tag: string; label: (kind?: WorkKind) => string }
> = {
  Live: {
    tag: "border-accent bg-accent text-paper",
    // kind ("Product"/"Research"/"Experiment") never equals "Live", so
    // when kind is present it is always prepended: "Product · Live".
    label: (kind) => (kind ? `${kind} · Live` : "Live"),
  },
  "In development": {
    tag: "border-accent text-accent",
    label: (kind) =>
      kind ? `${kind} · In development` : "In development",
  },
  Research: {
    tag: "border-ink text-ink",
    label: (kind) => (kind && kind !== "Research" ? `${kind} · Research` : "Research"),
  },
  Experiment: {
    tag: "border-dashed border-gray-400 text-gray-600",
    label: (kind) =>
      kind && kind !== "Experiment" ? `${kind} · Experiment` : "Experiment",
  },
};

export function Tag({
  status,
  kind,
  className = "",
}: {
  status: WorkStatus;
  kind?: WorkKind;
  className?: string;
}) {
  const v = VARIANTS[status];
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 font-mono text-meta uppercase ${v.tag} ${className}`}
    >
      {v.label(kind)}
    </span>
  );
}
