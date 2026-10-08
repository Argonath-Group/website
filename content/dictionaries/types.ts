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

export type NavItemLabel = "WORK" | "LAB" | "ABOUT" | "CONTACT";

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

export interface HomeLiveWorkItem {
  slug: "akita" | "labeler";
  name: string;
  oneLiner: string;
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
  liveWork: {
    heading: string; // TODO(content)
    items: HomeLiveWorkItem[];
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
/* Work archive                                                        */
/* ------------------------------------------------------------------ */

export type WorkStatus = "Live" | "Research" | "Experiment";
export type WorkKind = "Product" | "Research" | "Experiment";

export interface WorkEntry {
  slug: string;
  name: string;
  oneLiner: string;
  status: WorkStatus;
  kind: WorkKind;
  /** Year first shipped (or started, for research entries). */
  year: number;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Work detail: Akita                                                  */
/* ------------------------------------------------------------------ */

export interface AkitaCopy {
  name: string;
  overview: string;
  whatItDoes: string[];
  perCountryAdaptivity: string;
  capabilities: string[];
  demo: {
    heading: string; // TODO(content)
    body: string; // TODO(content)
    ctaLabel: string; // TODO(content)
    ctaHref: string; // TODO(content)
  };
  documentation: {
    heading: string; // TODO(content)
    body: string; // TODO(content)
    ctaHref: string; // TODO(content)
  };
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
/* Aggregate — what getDictionary(locale) returns                      */
/* ------------------------------------------------------------------ */

export interface Dictionary {
  siteMeta: SiteMeta;
  navItems: NavItem[];
  homeCopy: HomeCopy;
  workEntries: WorkEntry[];
  akitaCopy: AkitaCopy;
  labelerCopy: LabelerCopy;
  labIdentityLine: string;
  labEntries: LabEntry[];
  aboutCopy: AboutCopy;
  contactCopy: ContactCopy;
  labelerFormCopy: LabelerFormCopy;
}
