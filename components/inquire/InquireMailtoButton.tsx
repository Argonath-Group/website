"use client";

import { track } from "@vercel/analytics";
import { CONTACT_EMAIL, mailtoSubjects, type Intent } from "@/content/site";
import { LinkButton } from "@/components/ui/Button";

/**
 * InquireMailtoButton — the flag-off face of InquireCTA (D-027).
 *
 * A separate client component so the click can be tracked
 * (`cta_click`, intent) before the mail client opens; InquireCTA itself
 * stays a server component that reads the flag at request time. Subject
 * is the intent's dictionary subject, space-only encoded (D-012).
 */
export function InquireMailtoButton({
  intent,
  label,
  variant = "primary",
}: {
  intent: Intent;
  label: string;
  variant?: "primary" | "secondary";
}) {
  const subject = mailtoSubjects[intent].replace(/ /g, "%20");
  return (
    <LinkButton
      href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}
      variant={variant}
      onClick={() => track("cta_click", { intent })}
    >
      {label}
    </LinkButton>
  );
}
