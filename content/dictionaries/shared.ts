/**
 * content/dictionaries/shared.ts — locale-independent values used when
 * building dictionaries. CONTACT_EMAIL is defined HERE and ONLY here;
 * both dictionaries import it, and the barrel re-exports it, so the
 * address is single-sourced (D-022).
 */

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
