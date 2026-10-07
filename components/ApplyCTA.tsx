import { isSupabaseEnabled } from "@/lib/supabase";
import { labelerCopy } from "@/content/site";
import { LinkButton } from "@/components/ui/Button";
import { ApplyForm } from "@/components/apply/ApplyForm";

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
 *  - Supabase configured: renders the inline application form (a client
 *    component, D-010) inside the marked slot below. The
 *    `data-apply-slot` attribute and the `type` prop contract stay stable
 *    so callers and tests never change.
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

  return (
    <div
      data-apply-slot
      data-apply-type={type}
      className="border-t border-ink pt-8"
    >
      <ApplyForm type={type} />
    </div>
  );
}
