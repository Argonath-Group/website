/**
 * content/site.ts — single typed source of truth for ALL site copy.
 *
 * Rules for downstream agents:
 * - Import from here; never hardcode copy in components/pages.
 * - `// TODO(content)` marks copy that is not yet known. Do not invent facts.
 *   When content is supplied, replace the stub and remove the marker.
 * - Every occurrence of the studio contact email must use CONTACT_EMAIL.
 */

export const CONTACT_EMAIL = "gandalf@argonathgroup.com" as const;

/* ------------------------------------------------------------------ */
/* Site meta                                                           */
/* ------------------------------------------------------------------ */

export interface SiteMeta {
  name: string;
  description: string;
}

export const siteMeta: SiteMeta = {
  name: "Argonath Group",
  description:
    "An independent R&D studio working across visual technology, computational design, and experimental digital experiences.",
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type NavItemLabel = "WORK" | "LAB" | "ABOUT" | "CONTACT";

export interface NavItem {
  label: NavItemLabel;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "WORK", href: "/work" },
  { label: "LAB", href: "/lab" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

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
        // TODO(content)
        description:
          "Formal systems for generating, structuring, and evolving visual identity at scale.",
      },
      {
        title: "Human-in-the-Loop Data",
        // TODO(content)
        description:
          "Pipelines where expert judgement and machine processing reinforce each other.",
      },
      {
        title: "Adaptive Interfaces",
        // TODO(content)
        description:
          "Interfaces that reshape themselves around context, intent, and the person using them.",
      },
    ],
  },
  liveWork: {
    // TODO(content)
    heading: "Live work",
    items: [
      {
        slug: "akita",
        name: "Akita",
        oneLiner:
          "An adaptive visual identity engine that generates brand systems per market, per moment.",
      },
      {
        slug: "labeler",
        name: "Labeler",
        oneLiner:
          "A trust and skills network connecting companies with verified data professionals.",
      },
    ],
  },
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

export const workEntries: WorkEntry[] = [
  {
    slug: "akita",
    name: "Akita",
    oneLiner: homeCopy.liveWork.items[0].oneLiner,
    status: "Live",
    kind: "Product",
    year: 2024, // TODO(content)
    href: "/work/akita",
  },
  {
    slug: "labeler",
    name: "Labeler",
    oneLiner: homeCopy.liveWork.items[1].oneLiner,
    status: "Live",
    kind: "Product",
    year: 2025, // TODO(content)
    href: "/work/labeler",
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
    href: "/work/signal-field",
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
    href: "/work/parallax-loom",
  },
];

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

export const akitaCopy: AkitaCopy = {
  name: "Akita",
  overview:
    "Akita is an adaptive visual identity engine: a system that generates brand visuals that respond to market, audience, and context instead of shipping one fixed identity everywhere.",
  whatItDoes: [
    // TODO(content) — placeholder capability statements
    "Generates on-brand visual variations from a compact design-language definition.",
    "Tunes composition, palette, and motion per market and per placement.",
    "Stays inside brand constraints while never repeating the same output twice.",
  ],
  perCountryAdaptivity:
    "Akita treats identity as a language, not a logo file. The same brand speaks differently in each market — adjusting visual register, cultural references, and format behaviour while remaining unmistakably itself.", // TODO(content)
  capabilities: [
    // TODO(content) — placeholder capability list
    "Parametric identity generation",
    "Market- and audience-aware adaptation",
    "Template-free campaign asset production",
    "Design-system integration",
  ],
  demo: {
    // TODO(content)
    heading: "Try Akita",
    body: "See how one brand language adapts across markets in real time.",
    ctaLabel: "Open the live demo",
    ctaHref: "#", // TODO(content) — real demo URL
  },
  documentation: {
    // TODO(content)
    heading: "Documentation",
    body: "Technical notes on the identity engine, its constraint model, and integration APIs.",
    ctaHref: "#", // TODO(content) — real docs URL
  },
};

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

const mailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const labelerCopy: LabelerCopy = {
  name: "Labeler",
  overview:
    "Labeler is a trust and skills network for data work: it connects companies that need high-judgement data tasks done with verified professionals who can do them.", // TODO(content)
  forCompanies: {
    heading: "For companies",
    points: [
      // TODO(content)
      "Access a network of verified data professionals.",
      "Match work to demonstrated skills, not claims.",
      "Quality and trust built into the pipeline.",
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
      "Get verified for the skills you actually have.",
      "Receive work matched to your expertise.",
      "Build a portable reputation across engagements.",
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
      "Companies submit data work with skill requirements.",
      "Verified professionals are matched by demonstrated skill.",
      "Work is completed, reviewed, and feeds back into trust scores.",
    ],
  },
  trustAndSkills: {
    heading: "Trust & skills",
    body: "Labeler's core object is the skill credential: an earned, verifiable signal of what a professional can actually do. Trust compounds with every reviewed engagement.", // TODO(content)
  },
};

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

export interface ContactCopy {
  heading: string; // TODO(content)
  body: string; // TODO(content)
  email: string;
  location: string; // TODO(content)
  timezone: string; // TODO(content)
}

export const contactCopy: ContactCopy = {
  // TODO(content)
  heading: "Contact",
  body: "For collaborations, research partnerships, or anything in between, write to us directly.",
  email: CONTACT_EMAIL,
  location: "TODO(content)", // TODO(content)
  timezone: "TODO(content)", // TODO(content)
};
