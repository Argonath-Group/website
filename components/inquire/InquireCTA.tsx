import { isSupabaseEnabled } from "@/lib/supabase";
import type { Intent } from "@/content/site";
import { InquireForm } from "@/components/inquire/InquireForm";
import { InquireMailtoButton } from "@/components/inquire/InquireMailtoButton";

/**
 * InquireCTA — THE feature-flagged intake CTA (D-027). Generalizes the
 * deleted ApplyCTA (D-007/D-010) from the Labeler-only "company |
 * professional" pair to any inquiry intent.
 *
 * Contract:
 *
 *   <InquireCTA intent="akita_waitlist" label={akitaCopy.waitlistCta.label} />
 *   <InquireCTA intent="akita_partnership" label={...} variant="secondary" />
 *   <InquireCTA intent="project_collaboration" label={...} />
 *
 * Behavior:
 *  - Supabase NOT configured (isSupabaseEnabled() === false — the default
 *    production state): renders a mailto LinkButton to CONTACT_EMAIL with
 *    the intent's subject from `mailtoSubjects` (D-012 encoding). The
 *    click is tracked (`cta_click`) in the client button.
 *  - Supabase configured: renders InquireForm with the intent LOCKED —
 *    no dropdown, shown as a chip — inside the marked slot below. The
 *    wrapper attributes stay stable so callers and tests never change.
 *
 * This component is a server component by design: the flag is read at
 * request time. Removal over deprecation (D-027): ApplyCTA had no
 * callers left after D-023 demoted Labeler, so carrying it alongside
 * InquireCTA would fork the contract for zero consumers.
 */
export interface InquireCTAProps {
  intent: Intent;
  /** Button label (from the caller's page copy, e.g. akitaCopy.waitlistCta.label). */
  label: string;
  variant?: "primary" | "secondary";
}

export function InquireCTA({ intent, label, variant = "primary" }: InquireCTAProps) {
  if (!isSupabaseEnabled()) {
    return <InquireMailtoButton intent={intent} label={label} variant={variant} />;
  }

  return (
    <div data-inquire-slot data-inquire-intent={intent} className="border-t border-ink pt-8">
      <InquireForm intent={intent} />
    </div>
  );
}
