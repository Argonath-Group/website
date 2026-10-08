# content TODOs

Every `// TODO(content)` stub in `content/dictionaries/en.ts` (mirrored in
`es.ts` with `TODO(content): translate` markers), in one place. Do not
invent facts — replace stubs only with confirmed copy from the studio.

## Phase 1b restructure (D-023) — new stubs

- `homeCopy.featuredProjects.heading` — heading for the featured-projects
  block ("Featured projects" is first-draft).
- `projectsIndex` (kicker, heading, intro) — projects archive header copy.
- `projectEntries[].year` for akita / labeler — confirm years (products
  are in development; years are placeholders).
- `projectEntries` (signal-field, parallax-loom) — seeded future entries;
  confirm slugs, names, one-liners, years, or remove.
- `projectEntries.labeler.href` — empty while Labeler has no page; set a
  route if Labeler ever graduates to one.
- `akitaCopy.insight` — confirm heading ("The insight") and the
  per-country narrative (carries over from the former
  `perCountryAdaptivity`; Ecuador-first, LatAm expansion framing still
  needs studio confirmation).
- `akitaCopy.features.items` — confirm the feature list.
- `akitaCopy.waitlistCta` / `akitaCopy.partnerCta` — labels + mailto
  subjects ("Akita waitlist" / "Akita partnership"); Phase 2 replaces
  the mailto hrefs with the wired intake form.
- `partnersCopy` — the whole section is first-draft framing: intro, why-
  partner body, the four "who we'd like to hear from" groups, and the
  offer list all need studio confirmation (no partner categories or
  claims are final).
- `legalCopy.privacy` / `legalCopy.terms` — both pages ship as designed
  shells; real legal text must replace the stubs before any footer link
  goes live.

## Pre-restructure stubs (unchanged, still open)

- `homeCopy.focus.heading` — section heading for the R&D focus blocks.
- `homeCopy.focus.blocks[].description` — descriptions for Visual Language Systems / Human-in-the-Loop Data / Adaptive Interfaces.
- `homeCopy.labTeaser` (heading, body, ctaLabel) — lab teaser copy.
- `homeCopy.aboutTeaser` (heading, body, ctaLabel) — about teaser copy.
- `homeCopy.contactCta` (heading, body, ctaLabel) — contact CTA copy.
- `labelerCopy.overview` — confirm overview (kept for the deprecated ApplyCTA/Phase 2 intake; no page renders it today).
- `labelerCopy.forCompanies.points` — confirm points.
- `labelerCopy.forProfessionals.points` — confirm points.
- `labelerCopy.howItWorks.steps` — confirm steps.
- `labelerCopy.trustAndSkills.body` — confirm trust/skills narrative.
- `labIdentityLine` — confirm lab page identity line.
- `labEntries[]` — all 4 seeded entries are placeholders (titles, summaries, dates).
- `aboutCopy.positioning` — confirm studio positioning paragraph.
- `aboutCopy.thesis` — confirm thesis statement.
- `aboutCopy.founders[].bio` — bios for Sebastián Román and Andrés Cáceres.
- `contactCopy.heading` / `contactCopy.body` — confirm heading and body.
- `contactCopy.location` — studio location.
- `contactCopy.timezone` — studio timezone.
- `labelerFormCopy` (D-010) — all application-form strings (labels,
  placeholders, submit/submitting labels, success + failure copy) are
  provisional; confirm final copy.
- `SITE_URL` / production domain (D-011) — `lib/site-url.ts` falls back
  to `https://argonathgroup.com`; confirm the real domain (or set
  `NEXT_PUBLIC_SITE_URL`) before launch. The OG image, sitemap, and
  robots output all derive from it.
- `projects/[slug]` detail pages (signal-field, parallax-loom) — pages
  ship a designed "case study in progress" placeholder; confirm or write
  the real case-study content for each seeded entry (see also
  `projectEntries` above).
- Ecuador-first positioning (studio correction) — all Akita and Labeler
  copy is anchored to Ecuador-first + Latin America expansion, with NO
  ASL or European sign-language coverage claimed. The expansion framing
  in `akitaCopy.insight` and the regional phrasing in `labelerCopy`
  still need final confirmation from the studio.

## Required Supabase setup (D-010)

The `/api/apply` route inserts into `labeler_applications` using the
**anon** key. Before enabling Supabase (`NEXT_PUBLIC_SUPABASE_URL` +
`NEXT_PUBLIC_SUPABASE_ANON_KEY`), create the table and allow anonymous
inserts:

```sql
create table if not exists public.labeler_applications (
  id         bigint generated always as identity primary key,
  type       text not null check (type in ('company', 'professional')),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.labeler_applications enable row level security;

create policy "anon can insert applications"
  on public.labeler_applications
  for insert
  to anon
  with check (true);
```

Notes:
- Reading applications is NOT exposed through the site — use the Supabase
  dashboard or a service key out-of-band.
- If this setup is missing, the form degrades to its failure state with
  the mailto fallback (state C in DECISIONS.md), so nothing breaks visibly.

## i18n (D-021/D-022)

- `content/dictionaries/es.ts` — the ENTIRE Spanish dictionary is a
  stub identical to the English values. Every section needs human
  translation once the English copy is final (markers:
  `TODO(content): translate`). Do not machine-translate product names
  (Akita, Labeler) or the nav labels without studio sign-off.
- Phase 1b+ — wire `getDictionary(locale)` into the page tree so the
  cookie actually switches rendered copy (today only `<html lang>` and
  the cookie change; pages still render the English barrel consts).
