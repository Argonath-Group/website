/**
 * content/dictionaries/types.ts — every content interface, plus the
 * locale types and the aggregate Dictionary shape (D-022).
 *
 * Both `en.ts` and `es.ts` implement these interfaces, so a missing or
 * mistyped key in either dictionary is a COMPILE ERROR at build time —
 * key parity is enforced by the type system, not by discipline.
 */

/* ------------------------------------------------------------------ */
/* Locales                                                             */
/* ------------------------------------------------------------------ */

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/* ------------------------------------------------------------------ */
/* Shared (locale-independent)                                         */
/* ------------------------------------------------------------------ */

export interface SiteMeta {
  name: string;
  description: string;
}

export type NavItemLabel =
  | "PROJECTS"
  | "LAB"
  | "PARTNERS"
  | "ABOUT"
  | "CONTACT";

export interface NavItem {
  label: NavItemLabel;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

export interface HomeFocusBlock {
  title: string;
  description: string;
}

export interface HomeCopy {
  hero: {
    headline: string;
    sub: string;
  };
  focus: {
    heading: string; // TODO(content)
    blocks: HomeFocusBlock[];
  };
  /**
   * Featured projects block (D-023): Akita leads with coming-soon framing,
   * Labeler sits smaller as an in-development card with no link. Names,
   * one-liners, and the waitlist CTA are single-sourced from
   * `projectEntries` / `akitaCopy`; only the block heading lives here.
   */
  featuredProjects: {
    heading: string;
  };
  /** Heading for the selected-work archive block on Home. */
  selectedWorkHeading: string;
  labTeaser: {
    heading: string; // TODO(content)
    body: string; // TODO(content)
    ctaLabel: string; // TODO(content)
  };
  aboutTeaser: {
    heading: string; // TODO(content)
    body: string; // TODO(content)
    ctaLabel: string; // TODO(content)
  };
  contactCta: {
    heading: string; // TODO(content)
    body: string; // TODO(content)
    ctaLabel: string; // TODO(content)
  };
}

/* ------------------------------------------------------------------ */
/* Projects archive (D-023 — formerly "work")                          */
/* ------------------------------------------------------------------ */

/**
 * Status drives the Tag variant. "Live" stays in the union for cheap
 * stability but nothing ships as Live today: the two products are
 * "In development" (D-023), the seeded futures are Research/Experiment.
 */
export type WorkStatus = "Live" | "In development" | "Research" | "Experiment";
export type WorkKind = "Product" | "Research" | "Experiment";

export interface WorkEntry {
  slug: string;
  name: string;
  oneLiner: string;
  status: WorkStatus;
  kind: WorkKind;
  /** Year first shipped (or started, for research entries). */
  year: number;
  /**
   * Route to the entry's page. EMPTY STRING means the entry has no page
   * yet (e.g. Labeler, D-023) — indexes render it without a link.
   */
  href: string;
}

export interface ProjectsIndexCopy {
  kicker: string;
  heading: string;
  intro: string;
}

/* ------------------------------------------------------------------ */
/* Akita — coming soon page (D-023; not a case study)                  */
/* ------------------------------------------------------------------ */

export interface AkitaCopy {
  name: string;
  /** The per-country insight, brief form (sign languages are national). */
  insight: {
    heading: string;
    body: string;
  };
  features: {
    heading: string;
    items: string[];
  };
  /** Waitlist interest — mailto until Phase 2 wires the form. */
  waitlistCta: { label: string; href: string };
  /** Partnership interest — mailto until Phase 2 wires the form. */
  partnerCta: { label: string; href: string };
}

/* ------------------------------------------------------------------ */
/* Partners page (D-023)                                               */
/* ------------------------------------------------------------------ */

export interface PartnersCopy {
  heading: string;
  intro: string;
  why: {
    heading: string;
    body: string;
  };
  who: {
    heading: string;
    intro: string;
    groups: string[];
  };
  offer: {
    heading: string;
    items: string[];
  };
  cta: { label: string; href: string };
}

/* ------------------------------------------------------------------ */
/* Legal shells (D-023 — pages exist, copy pending)                    */
/* ------------------------------------------------------------------ */

export interface LegalPageCopy {
  heading: string;
  /** Short status line, e.g. "This page is being finalized." */
  status: string;
  /** Honest body — no invented legal text (D-014 convention). */
  body: string;
}

export interface LegalCopy {
  privacy: LegalPageCopy;
  terms: LegalPageCopy;
}

/* ------------------------------------------------------------------ */
/* Work detail: Labeler                                                */
/* ------------------------------------------------------------------ */

export interface LabelerCopy {
  name: string;
  overview: string;
  forCompanies: {
    heading: string;
    points: string[];
    cta: { label: string; href: string };
  };
  forProfessionals: {
    heading: string;
    points: string[];
    cta: { label: string; href: string };
  };
  howItWorks: {
    heading: string;
    steps: string[];
  };
  trustAndSkills: {
    heading: string;
    body: string;
  };
}

/* ------------------------------------------------------------------ */
/* Lab                                                                 */
/* ------------------------------------------------------------------ */

export interface LabEntry {
  slug: string;
  title: string;
  summary: string;
  status: "placeholder" | "draft" | "published";
  date: string; // ISO date
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export interface Founder {
  name: string;
  role: string;
  bio: string; // TODO(content) — all bios are stubs
}

export interface AboutCopy {
  positioning: string;
  thesis: string;
  founders: Founder[];
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export interface ContactCopy {
  heading: string; // TODO(content)
  body: string; // TODO(content)
  email: string;
  location: string; // TODO(content)
  timezone: string; // TODO(content)
}

/* ------------------------------------------------------------------ */
/* Labeler application form (D-010)                                    */
/* ------------------------------------------------------------------ */

export interface LabelerFormCopy {
  /** Accessible <label> for each field. */
  labels: {
    name: string;
    email: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  submitLabel: string;
  submittingLabel: string;
  success: {
    heading: string;
    body: string;
  };
  failure: {
    heading: string;
    /** Body copy; always followed by the mailto fallback link. */
    body: string;
    fallbackLabel: string;
  };
  /** Generic per-field error prefix; field name is appended. */
  fieldErrorRequired: string;
  invalidEmail: string;
}

/* ------------------------------------------------------------------ */
/* Inquiries intake (D-026 — supersedes the Labeler-only form)         */
/* ------------------------------------------------------------------ */

/**
 * Every intake intent the API accepts. The five `WebsiteIntent` values
 * are selectable on the website form; `labeler_*` exists for the
 * (currently unlinked) Labeler flow and future subdomains — it can be
 * rendered by InquireCTA with the intent locked, but never appears in
 * the public dropdown. Must stay in sync with the
 * `inquiries.intent` CHECK constraint in migration 0002.
 */
export const inquiryIntents = [
  "akita_waitlist",
  "akita_partnership",
  "project_collaboration",
  "press",
  "general",
  "labeler_company",
  "labeler_professional",
] as const;
export type Intent = (typeof inquiryIntents)[number];

/** Intents selectable in the website contact-form dropdown. */
export const websiteIntents = [
  "akita_waitlist",
  "akita_partnership",
  "project_collaboration",
  "press",
  "general",
] as const;
export type WebsiteIntent = (typeof websiteIntents)[number];

/** Conditional akita_partnership payload field. */
export const partnershipTypes = [
  "research",
  "distribution",
  "accessibility-program",
  "other",
] as const;
export type PartnershipType = (typeof partnershipTypes)[number];

/** Whitelisted request sources (migration 0002 CHECK constraint). */
export const inquirySources = ["website", "akita-app", "labeler-app"] as const;
export type InquirySource = (typeof inquirySources)[number];

export interface InquiryFormCopy {
  labels: {
    intent: string;
    name: string;
    email: string;
    org: string;
    message: string;
    partnershipType: string;
    links: string;
    timeline: string;
    consent: string;
  };
  placeholders: {
    name: string;
    email: string;
    org: string;
    message: string;
    links: string;
    timeline: string;
  };
  /** Intent chip shown when the form renders with a locked intent. */
  lockedIntentLabel: string;
  intentOptions: Record<WebsiteIntent, string>;
  partnershipTypeOptions: Record<PartnershipType, string>;
  submitLabel: string;
  submittingLabel: string;
  success: {
    heading: string;
    body: string;
  };
  failure: {
    heading: string;
    body: string;
    fallbackLabel: string;
  };
  privacy: {
    /** One-line note; rendered next to the consent checkbox. */
    note: string;
    linkLabel: string;
  };
  errors: {
    required: string;
    invalidEmail: string;
    invalidUrl: string;
    consentRequired: string;
    invalidIntent: string;
  };
  /** Decoy honeypot label (visually hidden from humans). */
  honeypotLabel: string;
}

/* ------------------------------------------------------------------ */
/* Aggregate — what getDictionary(locale) returns                      */
/* ------------------------------------------------------------------ */

export interface Dictionary {
  siteMeta: SiteMeta;
  navItems: NavItem[];
  homeCopy: HomeCopy;
  projectEntries: WorkEntry[];
  projectsIndex: ProjectsIndexCopy;
  akitaCopy: AkitaCopy;
  labelerCopy: LabelerCopy;
  partnersCopy: PartnersCopy;
  legalCopy: LegalCopy;
  labIdentityLine: string;
  labEntries: LabEntry[];
  aboutCopy: AboutCopy;
  contactCopy: ContactCopy;
  labelerFormCopy: LabelerFormCopy;
  inquiryFormCopy: InquiryFormCopy;
}
