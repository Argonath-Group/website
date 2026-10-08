/**
 * content/dictionaries/shared.ts — locale-independent values used when
 * building dictionaries. CONTACT_EMAIL is defined HERE and ONLY here;
 * both dictionaries import it, and the barrel re-exports it, so the
 * address is single-sourced (D-022).
 */

import type { Intent } from "./types";

export const CONTACT_EMAIL = "gandalf@argonathgroup.com" as const;

/**
 * mailto with ONLY spaces percent-encoded — the em-dash and other word
 * characters stay literal so the subject reads correctly in mail clients
 * and the hrefs match the agreed CTA contract exactly
 * (`Labeler%20—%20Company%20application`). D-012.
 */
export function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${subject.replace(/ /g, "%20")}`;
}

/**
 * Intent-keyed mailto subjects (D-027) — the flag-off fallback for every
 * InquireCTA. Locale-independent (like CONTACT_EMAIL): a Spanish speaker
 * emailing the studio can carry an English subject; translating subjects
 * would fork the inbox sorting. Values must stay greppable for whoever
 * triages the inbox.
 */
export const mailtoSubjects: Record<Intent, string> = {
  "akita_waitlist": "Akita waitlist",
  "akita_partnership": "Akita partnership",
  "project_collaboration": "Partnership inquiry",
  "press": "Press inquiry",
  "general": "General inquiry",
  "labeler_company": "Labeler — Company application",
  "labeler_professional": "Labeler — Professional application",
};
