import { isSupabaseEnabled } from "@/lib/supabase";
import { labelerCopy } from "@/content/site";
import { LinkButton } from "@/components/ui/Button";

/**
 * ApplyCTA — THE feature-flagged application CTA for Labeler (D-007).
 *
 * Contract for the Labeler page agent and the Supabase-form agent (5b):
 *
 *   <ApplyCTA type="company" />
 *   <ApplyCTA type="professional" />
 *
 * Behavior:
 *  - Supabase NOT configured (isSupabaseEnabled() === false):
 *    renders a primary mailto link to CONTACT_EMAIL whose subject and
 *    label come from labelerCopy (already URL-encoded in content).
 *  - Supabase configured: renders the marked placeholder slot below,
 *    which agent 5b replaces with the real application form. Keep the
 *    `data-apply-slot` attribute and the `type` prop contract stable —
 *    the form should render in place without callers changing.
 *
 * This component is a server component by design: the flag is read at
 * request time. Agent 5b may nest a client component inside the slot.
 */
export interface ApplyCTAProps {
  type: "company" | "professional";
}

export function ApplyCTA({ type }: ApplyCTAProps) {
  const copy =
    type === "company" ? labelerCopy.forCompanies : labelerCopy.forProfessionals;

  if (!isSupabaseEnabled()) {
    return (
      <LinkButton href={copy.cta.href} variant="primary">
        {copy.cta.label}
      </LinkButton>
    );
  }

  /* TODO(agent-5b): replace this placeholder with the Supabase-backed
     application form for `type`. Keep the wrapper attributes so pages
     and tests can target the slot. */
  return (
    <div
      data-apply-slot
      data-apply-type={type}
      className="border border-dashed border-gray-400 p-8 font-mono text-meta uppercase tracking-wide text-gray-500"
    >
      Application form — pending (Supabase enabled)
    </div>
  );
}
