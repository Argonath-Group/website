/**
 * content/site.ts — BARREL + locale entry points (D-021, D-022).
 *
 * Single import surface for ALL site copy. Every existing consumer
 * keeps working unchanged:
 *
 *   import { homeCopy, CONTACT_EMAIL, type WorkEntry } from "@/content/site";
 *
 * What lives where:
 * - `dictionaries/types.ts`   — all content interfaces + `locales`,
 *   `Locale`, and the aggregate `Dictionary` shape (key-parity contract).
 * - `dictionaries/shared.ts`  — CONTACT_EMAIL + the mailto helper,
 *   single-sourced, locale-independent.
 * - `dictionaries/en.ts`      — the English dictionary (default locale);
 *   its consts are re-exported here as today.
 * - `dictionaries/es.ts`      — the Spanish stub (identical values,
 *   TODO(content): translate markers), exposed only via getDictionary.
 * - `dictionaries/get-dictionary.ts` — `getDictionary(locale)`.
 *
 * Rules for downstream agents:
 * - Import from here; never hardcode copy in components/pages.
 * - `// TODO(content)` marks copy that is not yet known. Do not invent facts.
 *   When content is supplied, replace the stub and remove the marker.
 * - Every occurrence of the studio contact email must use CONTACT_EMAIL.
 * - Never import from `content/dictionaries/*` directly — pages and
 *   components go through this barrel only.
 */

export * from "./dictionaries/types";
export { CONTACT_EMAIL, mailtoSubjects } from "./dictionaries/shared";
export * from "./dictionaries/en";
export { getDictionary } from "./dictionaries/get-dictionary";
