# DECISIONS.md

Non-obvious calls made during the Argonath Group website build. Every deviation
from the brief, every added dependency, and every structural choice lives here.

## D-001 — Stack migration: Astro → Next.js

**Context:** The starting repo was a third-party Astro v7 starter template. The brief
mandates Next.js (App Router) + TypeScript + Tailwind.

**Decision:** Full migration. The Astro project (config, content collections,
layouts, components, astro-specific deps) is purged rather than adapted. The
repo is scaffolded fresh as a Next.js App Router project; nothing from the
template is carried over except git history.

**Rationale:** The brief's hard constraints (Vercel zero-config, App Router,
`content/site.ts` as typed source of truth, optional `/api/apply` route) are
Next-native. Adapting Astro would fight the constraint set.

## D-004 — Scaffold versions: Next.js 16.4, Tailwind 4.3

**Context:** Fresh Next.js scaffold after the template purge (D-001/D-003).

**Decision:** Pinned at install time to the latest stable releases:
Next.js **16.4.0** (App Router, TypeScript), React **19.3.0**,
Tailwind CSS **4.3.3** via `@tailwindcss/postcss` (zero-config PostCSS setup,
no tailwind.config file), TypeScript **5.9.3** (strict — TS 7.0 was released
but typescript-eslint does not support it yet, so we stay on the 5.9 line
until eslint-config-next catches up), ESLint **10.12.0**
flat config with `eslint-config-next` core-web-vitals + typescript presets.
Node engine `>= 22`.

**Rationale:** Latest stable line at scaffold date (2026-10-07); Tailwind v4's
CSS-first config keeps the scaffold dependency-free beyond the four approved
packages (next, react, react-dom, tailwind).

## D-002 — No animation library at scaffold time

**Context:** Brief permits `motion` (framer-motion) "only if needed."

**Decision:** Scaffold ships with zero animation dependencies. Hero and motion
primitives use canvas + CSS. Any later addition of `motion` requires a
DECISIONS.md entry.

**Rationale:** Perf budget (Lighthouse mobile ≥ 90 × 4), reduced-motion support,
and bundle size all favor starting dependency-free.

## D-003 — Package manager: npm

**Context:** Template used pnpm (`pnpm-lock.yaml`).

**Decision:** Fresh scaffold uses npm (`package-lock.json`). Remove pnpm lockfile
and `.npmrc` remnants tied to the template.

**Rationale:** Brief acceptance criteria literally check `npm run build`; keep
the happy path default.

## D-005 — Accent color: signal blue #1A3AFF (one hue only)

**Context:** Brief demands a restrained monochrome base plus EXACTLY ONE
accent, lab-appropriate, with WCAG AA contrast on both paper and ink.

**Decision:** Accent is **#1A3AFF** ("signal blue" — the blue of instrument
readouts, hyperlinks, and lab tape), with a single companion variant
**#7D8FFF** for use on ink backgrounds and **#1026B8** as the hover/depressed
state of accent fills. Measured WCAG contrast (WCAG 2.x relative luminance):
`#1A3AFF` on paper `#FBFBF8` = **6.55:1** (AA, passes AAA for large text);
paper text on `#1A3AFF` = 6.55:1 (filled buttons); `#7D8FFF` on ink `#141412`
= **6.36:1**. Rule: no second hue is introduced anywhere — grays are a single
ramp, selection color, focus ring, links, and the live-status Tag all reuse
the same blue.

**Rationale:** Signal blue reads "instrument / research output" rather than
"brand gradient" or "SaaS primary button". It is the one deliberate act of
color on an otherwise ink-and-paper page, which is exactly the lab register.
The gray ramp stays neutral-warm to keep paper from feeling clinical.

## D-006 — CaseStudy: the single work-detail template

**Context:** Agents 5a (Akita) and 5b (Labeler) build case-study pages in
parallel; they must not diverge visually or fork layout code.

**Decision:** All work detail pages render through
`components/case-study/CaseStudy.tsx`. Contract (TypeScript):

```ts
interface CaseStudySection { id?: string; title: string; children: ReactNode }
interface CaseStudyProps {
  entry: WorkEntry;        // from content/site.ts
  backLabel?: string;      // default "← Work"
  sections: CaseStudySection[];
  footer?: ReactNode;      // CTA / cross-link slot
}
```

The template owns: breadcrumb to `/work`, hero header (Tag + name +
one-liner + year), numbered asymmetric sections (4/7+1 grid), and the
footer slot. Page agents only pass content — no per-page layout, no forks.

**Rationale:** One template = one rhythm. Parallel agents cannot drift.

## D-007 — ApplyCTA: feature-flagged application CTA contract

**Context:** Labeler pages need an "Apply" CTA that works with zero env vars
today and gains a Supabase form later without page-level changes.

**Decision:** `components/ApplyCTA.tsx` is a server component with the stable
API:

```ts
interface ApplyCTAProps { type: "company" | "professional" }
```

Behavior: when `isSupabaseEnabled()` (lib/supabase.ts) is false → primary
`LinkButton` mailto to `CONTACT_EMAIL` with subject/label taken from
`labelerCopy.forCompanies.cta` / `labelerCopy.forProfessionals.cta`
(already URL-encoded in content). When true → a marked placeholder slot
(`data-apply-slot`, `data-apply-type`) that agent 5b replaces with the real
form. Callers never change; the flag flips at request time.

**Rationale:** Pages can ship now against a stable API; the form lands
later without touching the Labeler pages or the contract.

## D-008 — Type pairing: Space Grotesk + IBM Plex Sans/Mono

**Context:** Brief asks for a distinctive variable pairing via
next/font/google, not the Inter default.

**Decision:** Space Grotesk (display: headlines, wordmark — grotesque with
character, tight negative tracking), IBM Plex Sans (400/500: body — neutral
research-lab register), IBM Plex Mono (400: tags, labels, metadata,
buttons — instrument readout feel). All self-hosted by Next, `display: swap`,
exposed as CSS variables consumed by the Tailwind v4 `@theme` font tokens.

**Rationale:** The trio carries the "research lab + art/tech studio"
perception purely through typography: display scale has presence, mono
metadata reads like lab instrumentation, and nothing defaults to Inter.

## D-009 — OG image: deferred to QA agent

**Context:** `app/opengraph-image` is not built in this pass.

**Decision:** TODO for the QA agent — generate a static OG image (1200×630)
reusing the icon glyph, wordmark, and signal blue on paper. No runtime
generation, no new dependencies.

**Rationale:** Out of the design-system scope; a static asset fits the
zero-dependency budget.

## D-010 — /api/apply: Supabase-backed application endpoint

**Context:** Labeler applications need an inline form when Supabase is
configured (D-007 flag), but the site must build, run, and behave
correctly with zero env vars.

**Decision:** Three states, one code path:

- **A. Disabled** (`isSupabaseEnabled() === false`, the no-env default):
  `GET` and `POST` on `/api/apply` return 404 JSON; `ApplyCTA` renders the
  mailto `LinkButton` exactly as before.
- **B. Enabled + valid env:** `ApplyCTA` renders the inline form
  (`components/apply/ApplyForm.tsx`, client component) posting to the
  route. The route validates by hand (no zod — zero new validation deps),
  inserts `{ type, name, email, message, created_at }` into the Supabase
  table `labeler_applications` with the anon key, and returns
  `{ ok: true }`.
- **C. Enabled + malformed env** (bad URL, rejected key, RLS denial,
  missing table): the form still renders (the flag only checks presence);
  every failure — rejected Supabase result or thrown exception — is caught
  and returned as **502 JSON `{ ok: false, error }`**. The route has a
  last-resort catch and can never crash with a 500 HTML page; the form's
  failure state always shows the mailto fallback link so the applicant
  always has an out.

**New dependency:** `@supabase/supabase-js@^2` (the one approved addition).

**Required Supabase setup (not code):** the `labeler_applications` table
must exist with **RLS enabled and a policy allowing anonymous INSERT** —
the anon key can only insert if the policy permits it. Applications are
read back out-of-band ( Supabase dashboard / service key), never through
this site. The table schema (SQL) lives in `content/TODO.md`.

**Rationale:** One dependency (Supabase's first-party client), no zod, no
edge cases leaking into page code. State C is the realistic production
failure mode, so the contract optimizes for graceful degradation to the
mailto path rather than hard failure.

## D-011 — Site URL, metadataBase, sitemap, robots, OG image (QA pass)

**Context:** Deploy-readiness QA found no sitemap, no robots, no OG
image, no `metadataBase`, and no per-route metadata on `work/[slug]`
(D-009 had deferred the OG image to the QA agent).

**Decision:**
- `lib/site-url.ts` exports `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  ?? "https://argonathgroup.com"` — env-optional, one fallback, used by
  `metadataBase` (app/layout.tsx), `app/sitemap.ts`, and `app/robots.ts`.
  **TODO(content):** the fallback domain is assumed, not confirmed.
- `app/sitemap.ts` lists every static route plus every `workEntries`
  href and every `labEntries` slug. No `lastModified` (the content dates
  are TODO stubs), so the sitemap stays fully static.
- `app/robots.ts` allows everything and points at the sitemap.
- `app/opengraph-image.tsx` fulfills D-009: a static 1200×630 build-time
  `ImageResponse` (next/og) — typography-led, design tokens only (paper,
  ink, signal blue, mono register), no new deps, no sharp, no runtime
  generation.
- `app/work/[slug]/page.tsx` gained `generateMetadata` (title +
  description from the `WorkEntry`); `app/lab/[slug]` already had it.

**Rationale:** All four artifacts are static and config-free, so Vercel
free tier is unaffected and the no-env clean-room build still passes.

## D-012 — Mailto subjects: encode spaces only, keep the em-dash literal

**Context:** QA found the Labeler CTA hrefs rendered
`subject=Labeler%20%E2%80%94%20Company%20application` (full
`encodeURIComponent`), while the agreed contract is
`Labeler%20—%20Company%20application` (spaces encoded, em-dash literal).

**Decision:** The `mailto` helper in `content/site.ts` now encodes
spaces only (`subject.replace(/ /g, "%20")`). Em-dashes and word
characters stay literal; mail clients decode identically and the hrefs
match the contract exactly.

## D-013 — gray-500 darkened to #6A6A64 (WCAG AA fix)

**Context:** QA measured the meta/secondary gray used across the site at
small sizes: `#787870` on paper = **4.29:1**, below WCAG AA 4.5:1 for
normal text (it appears in mono meta labels, archive metadata, founder
roles). `#9C9C94` (gray-400) on paper = 2.67:1 and was used as visible
text for the Lab index numbers.

**Decision:** `--color-gray-500` is now `#6A6A64` (5.25:1 on paper,
4.89:1 on gray-100). The Lab index numbers moved from gray-400 to
gray-500. The accent blues are unchanged (6.55:1 / 6.36:1). Remaining
gray-400 usages are `aria-hidden` decorations (archive column labels,
row arrows) where contrast rules do not apply.

## D-014 — No literal "TODO(content)" in visible HTML

**Context:** QA found the literal token `TODO(content)` rendered in the
built HTML of /about (founder bios), /contact (location/timezone rows),
and all four lab detail pages.

**Decision:** Stubs now render as designed markers — "Bio forthcoming.",
"To be confirmed.", "Documentation pending" — matching the existing
designed-placeholder convention (dashed frames, mono meta register). The
`TODO(content)` marker survives only in source comments and
`content/TODO.md`, never in visible output.

## D-015 — work/[slug] renders through CaseStudy instead of a dev stub

**Context:** The dynamic work-detail route rendered
`Route: /work/{slug} — {name}` — a dev placeholder leaking into
production HTML for /work/signal-field and /work/parallax-loom.

**Decision:** The route now composes the shared `CaseStudy` template
(D-006) with the entry's real archive data (tag, name, one-liner, year,
overview) plus a designed "Case study in progress" placeholder block —
same convention as the Lab (D-014). No invented case-study content.
