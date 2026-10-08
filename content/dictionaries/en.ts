/**
 * content/dictionaries/en.ts — the English dictionary (default locale,
 * D-022). Moved verbatim from the former content/site.ts; every export
 * keeps its name and shape so the barrel re-export is a no-op for
 * existing consumers.
 *
 * `enDictionary` aggregates all exports by reference, so
 * `getDictionary("en").homeCopy === homeCopy` — same object identity.
 */

import { CONTACT_EMAIL, mailto } from "./shared";
import type {
  AboutCopy,
  AkitaCopy,
  ContactCopy,
  Dictionary,
  HomeCopy,
  InquiryFormCopy,
  LabEntry,
  LabelerCopy,
  LabelerFormCopy,
  LegalCopy,
  NavItem,
  PartnersCopy,
  ProjectsIndexCopy,
  SiteMeta,
  WorkEntry,
} from "./types";

export { CONTACT_EMAIL };

/* ------------------------------------------------------------------ */
/* Site meta                                                           */
/* ------------------------------------------------------------------ */

export const siteMeta: SiteMeta = {
  name: "Argonath Group",
  description:
    "An independent R&D studio working across visual technology, computational design, and experimental digital experiences.",
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navItems: NavItem[] = [
  { label: "PROJECTS", href: "/projects" },
  { label: "LAB", href: "/lab" },
  { label: "PARTNERS", href: "/partners" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

export const homeCopy: HomeCopy = {
  hero: {
    headline: "We research and build new ways to see, create, and interact.",
    sub: "An independent R&D studio working across visual technology, computational design, and experimental digital experiences.",
  },
  focus: {
    // TODO(content)
    heading: "What we research",
    blocks: [
      {
        title: "Visual Language Systems",
        description:
          "Teaching, representing, and annotating sign language — how a visual language is learned, structured, and made legible to people and machines.",
      },
      {
        title: "Human-in-the-Loop Data",
        description:
          "Connecting domain experts to curation pipelines — pipelines where expert judgement shapes the data machines learn from.",
      },
      {
        title: "Adaptive Interfaces",
        description:
          "Localization, personalization, and learning systems — interfaces that reshape themselves around the person using them.",
      },
    ],
  },
  featuredProjects: {
    // TODO(content)
    heading: "Featured projects",
  },
  selectedWorkHeading: "Selected work",
  labTeaser: {
    // TODO(content)
    heading: "The Lab",
    body: "Open experiments at the edge of our research spine — visual languages, adaptive systems, and new interaction models.",
    ctaLabel: "Explore the Lab",
  },
  aboutTeaser: {
    // TODO(content)
    heading: "About the studio",
    body: "Argonath Group is an independent R&D studio founded to explore how computation changes what we see and make.",
    ctaLabel: "About us",
  },
  contactCta: {
    // TODO(content)
    heading: "Start a conversation",
    body: "We take on a small number of collaborations and research partnerships each year.",
    ctaLabel: "Contact",
  },
};

/* ------------------------------------------------------------------ */
/* Projects archive (D-023 — formerly "work"; /projects routes)        */
/* ------------------------------------------------------------------ */

export const projectsIndex: ProjectsIndexCopy = {
  // TODO(content)
  kicker: "Argonath Group — Projects",
  heading: "Projects",
  intro: "Everything we're building — products in development, research, and experiments. Including the unfinished things.",
};

/**
 * One-liners were previously referenced from homeCopy.liveWork; they are
 * inlined here now (D-023) — the featured-projects block and the indexes
 * read from this list, single-sourced. Labeler has href "" (no page, no
 * link — D-023) and stays in the archive as an in-development card.
 */
export const projectEntries: WorkEntry[] = [
  {
    slug: "akita",
    name: "Akita",
    oneLiner:
      "Our first product — a sign language learning app that adapts to your country's sign language, starting in Ecuador.",
    status: "In development",
    kind: "Product",
    year: 2024, // TODO(content)
    href: "/projects/akita",
  },
  {
    slug: "labeler",
    name: "Labeler",
    oneLiner:
      "A marketplace for curated visual datasets, connecting companies across Latin America — starting in Ecuador — with the professionals who annotate them.",
    status: "In development",
    kind: "Product",
    year: 2025, // TODO(content)
    href: "", // no page yet (D-023) — indexes render this entry unlinked
  },
  {
    // TODO(content) — seeded future entry
    slug: "signal-field",
    name: "Signal Field",
    oneLiner:
      "A research probe into live, data-driven visual languages for broadcast environments.",
    status: "Research",
    kind: "Research",
    year: 2026, // TODO(content)
    href: "/projects/signal-field",
  },
  {
    // TODO(content) — seeded future entry
    slug: "parallax-loom",
    name: "Parallax Loom",
    oneLiner:
      "An experiment in weaving adaptive layout systems from content structure alone.",
    status: "Experiment",
    kind: "Experiment",
    year: 2026, // TODO(content)
    href: "/projects/parallax-loom",
  },
];

/* ------------------------------------------------------------------ */
/* Akita — coming soon page (D-023; not a case study)                  */
/*                                                                     */
/* Ecuador-first / LatAm positioning. NO ASL or European sign-language */
/* claims (see TODO.md).                                               */
/* ------------------------------------------------------------------ */

export const akitaCopy: AkitaCopy = {
  name: "Akita",
  insight: {
    // TODO(content) — confirm heading; body carries over from the former
    // per-country narrative, trimmed to brief form.
    heading: "The insight",
    body: "Sign languages are national, not universal — Ecuador's sign language and those of its neighbors are distinct languages, as different from each other as spoken ones. Akita starts from Ecuadorian Sign Language and treats the learner's country as the first design input: curriculum, vocabulary, and regional variation all follow the national sign language, with expansion across Latin America planned.",
  },
  features: {
    // TODO(content) — feature list pending review
    heading: "Features",
    items: [
      "Ecuadorian Sign Language curriculum",
      "Per-country curriculum adaptation as we expand",
      "Regional variation support",
      "Adaptive pacing and review",
    ],
  },
  waitlistCta: {
    label: "Join the waitlist",
    href: mailto("Akita waitlist"), // TODO(content) — Phase 2 wires the form
  },
  partnerCta: {
    label: "Partner with us",
    href: mailto("Akita partnership"), // TODO(content) — Phase 2 wires the form
  },
};

/* ------------------------------------------------------------------ */
/* Partners page (D-023)                                               */
/* ------------------------------------------------------------------ */

export const partnersCopy: PartnersCopy = {
  // TODO(content) — whole section is first-draft framing; the studio
  // confirms target partner groups and offer wording.
  heading: "Partners",
  intro: "We take on a small number of collaborations and research partnerships each year. If your institution or company works on what we research, we would like to hear from you.",
  why: {
    heading: "Why partner with the studio",
    body: "Argonath Group is an independent R&D studio working across visual technology, computational design, and experimental digital experiences. Partnerships let us take on problems that need sustained research and take them further than a single product cycle allows.",
  },
  who: {
    heading: "Who we'd like to hear from", // TODO(content) — confirm framing
    intro: "We are open to conversations with:",
    groups: [
      "Research partners — universities and labs working on sign language, visual languages, or adaptive systems.",
      "Accessibility programs — organizations expanding access to sign language and visual communication.",
      "Schools and educators — institutions that could put Akita in front of learners.",
      "Companies with visual-data needs — teams that need curated, annotated visual data.",
    ],
  },
  offer: {
    heading: "What the studio brings",
    items: [
      "R&D — research across visual technology and computational design.",
      "Visual technology — systems for seeing, representing, and interacting.",
      "Adaptive systems — software that reshapes itself around the person using it.",
    ],
  },
  cta: {
    label: "Start a partnership conversation",
    href: mailto("Partnership inquiry"),
  },
};

/* ------------------------------------------------------------------ */
/* Legal shells (D-023)                                                */
/* ------------------------------------------------------------------ */

export const legalCopy: LegalCopy = {
  // TODO(content) — both pages ship as designed shells; real legal text
  // replaces these stubs before the pages are linked anywhere.
  privacy: {
    heading: "Privacy",
    status: "This page is being finalized.",
    body: "The Argonath Group privacy policy will be published here before launch. Until then, we keep this page honest rather than inventing text we are not ready to stand behind. For any question about your data, write to us directly.",
  },
  terms: {
    heading: "Terms",
    status: "This page is being finalized.",
    body: "The Argonath Group terms of service will be published here before launch. Until then, we keep this page honest rather than inventing text we are not ready to stand behind. For any question, write to us directly.",
  },
};

/* ------------------------------------------------------------------ */
/* Work detail: Labeler                                                */
/* ------------------------------------------------------------------ */

export const labelerCopy: LabelerCopy = {
  name: "Labeler",
  overview:
    "Labeler is a marketplace for curated visual datasets, operating in Ecuador and expanding across Latin America. Companies that need annotated data apply and define their dataset; vetted professionals across the region — many with sign-language and visual-domain expertise — annotate it. The value is curation, not raw labor.", // TODO(content)
  forCompanies: {
    heading: "For companies",
    points: [
      // TODO(content)
      "Apply and define the dataset you need.",
      "Get matched with vetted professionals across Ecuador and Latin America.",
      "Receive curated, quality-assured data.",
    ],
    cta: {
      label: "Apply as a company",
      href: mailto("Labeler — Company application"),
    },
  },
  forProfessionals: {
    heading: "For professionals",
    points: [
      // TODO(content)
      "Apply and get verified for your skills, starting in Ecuador.",
      "Get matched on expertise — including sign language and visual domains.",
      "Complete tasks and receive payment.",
    ],
    cta: {
      label: "Apply as a professional",
      href: mailto("Labeler — Professional application"),
    },
  },
  howItWorks: {
    heading: "How it works",
    steps: [
      // TODO(content)
      "A company applies and defines the dataset it needs.",
      "Labeler matches the work with vetted professionals by skill.",
      "Professionals annotate; every task is quality-reviewed.",
      "Curated data is delivered to the company.",
    ],
  },
  trustAndSkills: {
    heading: "Trust & skills",
    body: "Professionals are vetted for the skills they actually claim — sign language fluency and visual-domain expertise are verified, not self-reported. Work is reviewed before delivery, so quality compounds with every completed task.", // TODO(content)
  },
};

/* ------------------------------------------------------------------ */
/* Lab                                                                 */
/* ------------------------------------------------------------------ */

export const labIdentityLine =
  "The Lab is where the studio's research spine becomes visible — small, open experiments in visual language, adaptive systems, and interaction."; // TODO(content)

export const labEntries: LabEntry[] = [
  {
    slug: "glyph-atlas",
    title: "Glyph Atlas",
    summary:
      "Placeholder experiment — a generative atlas mapping how a visual language deforms across contexts.",
    status: "placeholder",
    date: "2026-01-01", // TODO(content)
  },
  {
    slug: "adaptive-grid-studies",
    title: "Adaptive Grid Studies",
    summary:
      "Placeholder experiment — grid systems that reorganise themselves around content structure.",
    status: "placeholder",
    date: "2026-01-01", // TODO(content)
  },
  {
    slug: "signal-drawings",
    title: "Signal Drawings",
    summary:
      "Placeholder experiment — live data rendered as continuous drawing, exploring data as a visual language.",
    status: "placeholder",
    date: "2026-01-01", // TODO(content)
  },
  {
    slug: "loop-statements",
    title: "Loop Statements",
    summary:
      "Placeholder experiment — typographic systems generated from recursive rules.",
    status: "placeholder",
    date: "2026-01-01", // TODO(content)
  },
];

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const aboutCopy: AboutCopy = {
  positioning:
    "Argonath Group is an independent R&D studio. We research and build across visual technology, computational design, and experimental digital experiences.", // TODO(content)
  thesis:
    "Computation changed what can be made; we work on what it should look like and how people should interact with it.", // TODO(content)
  founders: [
    {
      name: "Sebastián Román",
      role: "Cofounder",
      bio: "TODO(content)", // TODO(content)
    },
    {
      name: "Andrés Cáceres",
      role: "Cofounder",
      bio: "TODO(content)", // TODO(content)
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contactCopy: ContactCopy = {
  // TODO(content)
  heading: "Contact",
  body: "For collaborations, research partnerships, or anything in between, write to us directly.",
  email: CONTACT_EMAIL,
  location: "TODO(content)", // TODO(content)
  timezone: "TODO(content)", // TODO(content)
};

/* ------------------------------------------------------------------ */
/* Labeler application form (D-010)                                    */
/* ------------------------------------------------------------------ */

export const labelerFormCopy: LabelerFormCopy = {
  // TODO(content) — all form strings pending final copy.
  labels: {
    name: "Name",
    email: "Email",
    message: "Message",
  },
  placeholders: {
    name: "Your full name",
    email: "you@example.com",
    message: "Tell us briefly about your company or your work.",
  },
  submitLabel: "Send application",
  submittingLabel: "Sending…",
  success: {
    heading: "Application received",
    body: "Thank you — we review every application personally and will reply from our own inbox.",
  },
  failure: {
    heading: "Something went wrong",
    body: "The form could not send your application. You can always reach us directly:",
    fallbackLabel: "Email us instead",
  },
  fieldErrorRequired: "Required field:",
  invalidEmail: "Enter a valid email address.",
};

/* ------------------------------------------------------------------ */
/* Inquiries intake form (D-026/D-027)                                 */
/* ------------------------------------------------------------------ */

export const inquiryFormCopy: InquiryFormCopy = {
  // TODO(content) — all form strings are provisional first drafts.
  labels: {
    intent: "What is this about?",
    name: "Name",
    email: "Email",
    org: "Organization",
    message: "Message",
    partnershipType: "Partnership type",
    links: "Links",
    timeline: "Timeline",
    consent: "Consent",
  },
  placeholders: {
    name: "Your full name",
    email: "you@example.com",
    org: "Company, institution, or publication",
    message: "Tell us what you have in mind.",
    links: "https://…",
    timeline: "When are you hoping to start?",
  },
  lockedIntentLabel: "Topic",
  intentOptions: {
    akita_waitlist: "Join the Akita waitlist",
    akita_partnership: "Partner with us on Akita",
    project_collaboration: "Project collaboration",
    press: "Press",
    general: "General",
  },
  partnershipTypeOptions: {
    research: "Research",
    distribution: "Distribution",
    "accessibility-program": "Accessibility program",
    other: "Other", // TODO(content)
  },
  submitLabel: "Send inquiry",
  submittingLabel: "Sending…",
  success: {
    heading: "Inquiry received",
    body: "Thank you — we read every message personally and will reply from our own inbox.",
  },
  failure: {
    heading: "Something went wrong",
    body: "The form could not send your inquiry. You can always reach us directly:",
    fallbackLabel: "Email us instead",
  },
  privacy: {
    note: "We use what you send only to reply to you. Details:",
    linkLabel: "Privacy",
  },
  errors: {
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    invalidUrl: "Enter a valid URL.",
    consentRequired: "Please accept before sending.",
    invalidIntent: "Choose a topic.",
  },
  honeypotLabel: "Website (leave this field empty)",
};

/* ------------------------------------------------------------------ */
/* Aggregate                                                           */
/* ------------------------------------------------------------------ */

export const enDictionary: Dictionary = {
  siteMeta,
  navItems,
  homeCopy,
  projectEntries,
  projectsIndex,
  akitaCopy,
  labelerCopy,
  partnersCopy,
  legalCopy,
  labIdentityLine,
  labEntries,
  aboutCopy,
  contactCopy,
  labelerFormCopy,
  inquiryFormCopy,
};
