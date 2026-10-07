# content TODOs

Every `// TODO(content)` stub in `content/site.ts`, in one place. Do not invent
facts — replace stubs only with confirmed copy from the studio.

- `homeCopy.focus.heading` — section heading for the R&D focus blocks.
- `homeCopy.focus.blocks[].description` — descriptions for Visual Language Systems / Human-in-the-Loop Data / Adaptive Interfaces.
- `homeCopy.liveWork.heading` — heading for the live work section.
- `homeCopy.labTeaser` (heading, body, ctaLabel) — lab teaser copy.
- `homeCopy.aboutTeaser` (heading, body, ctaLabel) — about teaser copy.
- `homeCopy.contactCta` (heading, body, ctaLabel) — contact CTA copy.
- `workEntries[].year` for akita / labeler — confirm ship years.
- `workEntries` (signal-field, parallax-loom) — seeded future entries; confirm slugs, names, one-liners, years, or remove.
- `akitaCopy.whatItDoes` — confirm capability statements.
- `akitaCopy.perCountryAdaptivity` — confirm adaptivity narrative.
- `akitaCopy.capabilities` — confirm capability list.
- `akitaCopy.demo` (heading, body, ctaLabel, ctaHref) — copy + real demo URL.
- `akitaCopy.documentation` (heading, body, ctaHref) — copy + real docs URL.
- `labelerCopy.overview` — confirm overview.
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
- `work/[slug]` detail pages (signal-field, parallax-loom) — pages ship
  a designed "case study in progress" placeholder; confirm or write the
  real case-study content for each seeded entry (see also
  `workEntries` above).
- Ecuador-first positioning (studio correction) — all Akita and Labeler
  copy is anchored to Ecuador-first + Latin America expansion, with NO
  ASL or European sign-language coverage claimed. The expansion framing
  in `akitaCopy.perCountryAdaptivity` and the regional phrasing in
  `labelerCopy` still need final confirmation from the studio.

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
