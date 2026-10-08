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

## D-016 — SITE_URL normalization: tolerate env values without a protocol

**Context:** The Vercel production build failed with
`ERR_INVALID_URL: new URL(SITE_URL)` because `NEXT_PUBLIC_SITE_URL` was
set to `argonathgroup.com` — no `https://` prefix — and the raw value
was fed into `new URL()` for `metadataBase`.

**Decision:** `lib/site-url.ts` normalizes the env value instead of
requiring an exact format: trim whitespace, strip trailing slashes, and
prepend `https://` when no `http(s)://` prefix is present. Empty/absent
falls back to `https://argonathgroup.com`. The export stays a plain
string constant, safe for `new URL()` at module scope in any
environment.

**Rationale:** Env values typed by hand in dashboards are unreliable at
the edges; normalizing at the single point of consumption (this module)
is cheaper than fixing every deployment's env format and never breaks
the no-env build.

## D-017 — @vercel/analytics for page-view analytics

**Context:** The studio wants lightweight, privacy-friendly traffic
measurement without adding infrastructure.

**Decision:** Added `@vercel/analytics@^2` (the one new runtime
dependency). `app/layout.tsx` renders `<Analytics />` from
`@vercel/analytics/next` as the last child of `<body>`, so every route
is measured once from the root layout. It is a client component inside
the server layout, needs no env vars, and does not affect the no-env
build or the static prerender of any page.

**Rationale:** Zero-config on Vercel, free-tier friendly, first-party,
and no cookie/consent surface beyond Vercel's standard data policy —
versus self-hosted analytics (new infra) or a third-party script
(external dependency + CSP surface).

## D-018 — Supabase CLI + migrations-in-repo: GitHub is the source of truth

**Context:** Schema was previously documented as a SQL block in
`content/TODO.md` that the user had to paste into the dashboard by hand.

**Decision:** Migrations now live in `supabase/migrations/` and are applied
automatically on merge to main (see D-019). The dashboard is read-only for
schema from now on — hand-edits drift and will be overwritten by the next
`supabase db push`. The CLI is pinned at **v2.120.0** in
`supabase/config.toml` (generated via `npx supabase@2.120.0 init`, edited
only for `project_id`) and in both workflows. The CLI is consumed via
`npx` (local) and `supabase/setup-cli` (CI) — it is deliberately NOT a
package.json dependency: it is not imported by the app, pinning it in
package.json would couple app dependency audits to an ops tool, and the
official distribution channel for the CLI is the standalone binary.

## D-019 — Two-workflow CI/CD split: PR gate vs merge-time migration push

**Context:** One workflow could do both, but PR jobs and deploy jobs want
different trust boundaries.

**Decision:** `.github/workflows/ci.yml` runs on `pull_request` and pushes
to main with **no secrets**: checkout → setup-node 22 → `npm ci` →
typecheck → lint → build (no `.env`, preserving the clean-room guarantee),
plus a migration sanity check. `supabase db lint` needs a live database
(local requires Docker — unavailable/undesirable in a PR job; linked
requires project secrets we will not expose to PR runs), so CI instead
structurally validates every `supabase/migrations/*.sql` (non-empty,
contains a terminated statement) and verifies the CLI can load
`supabase/config.toml`. `.github/workflows/migrations.yml` runs only on
push to main with `paths: supabase/**`, links with the two repository
secrets, runs `supabase migration list` for dry-run visibility, then
`supabase db push`. Splitting means a PR can never touch the production
database and the deploy surface is one small, auditable workflow.

**Required repository secrets:** `SUPABASE_ACCESS_TOKEN` and
`SUPABASE_PROJECT_REF`.

## D-020 — Migration 0001 captures the CURRENT labeler_applications schema

**Context:** The deployed `/api/apply` feature flag (D-010) inserts into
`labeler_applications` today. Phase 2 will introduce an `inquiries` table
and drop `labeler_applications`.

**Decision:** `supabase/migrations/0001_labeler_applications.sql` is a
byte-faithful capture of the canonical block in `content/TODO.md`
("Required Supabase setup (D-010)") — table, RLS enable, anon insert
policy. Migration 0001 must never be rewritten or reordered, even when
Phase 2 lands; the `inquiries` transition arrives as migration 0002+
which drops/replaces the old table. Schema history is append-only, so any
environment (local, staging, production) can replay from zero.

## D-021 — Cookie-only i18n: one URL, two locales, zero redirects

**Context:** The studio needs English (default) + Spanish without URL
changes (`/es/...` prefixes were ruled out: they split link equity,
double the route surface, and complicate the lab/work slugs).

**Decision:** Hand-rolled, cookie-only i18n — no next-intl, no i18n
library, no middleware rewrites:

- **Selection**: a persistent `locale` cookie (`en` default, `es` via a
  nav EN/ES toggle that POSTs to `/api/locale` and `router.refresh()`es).
  The same URL serves both locales; there is NEVER a redirect or rewrite.
- **First-visit detection** (`detectLocale`, a pure function in
  `lib/locale.ts`): `es` if `Accept-Language` starts with `es`; if the
  header is absent/ambiguous (`""` or `*`), `x-vercel-ip-country` (Vercel
  header) in the LatAm set `["EC","MX","CO","AR","PE","CL","VE","BO","PY",
  "UY","CR","PA","NI","GT","HN","SV","DO","CU","PR"]` (EC first — home
  market) decides; otherwise `en`. Country alone never overrides an
  explicit non-Spanish language preference. Middleware sets the cookie
  (1 year, SameSite=Lax) and passes the response through — no redirect.
- **Rendering**: the root layout resolves the locale per request
  (`cookies()`), sets `<html lang>`, and provides the dictionary via
  context (`DictionaryProvider`). NOTE: the provider is a CLIENT
  component — server components cannot render React context providers
  in the App Router ("Element type is invalid"); the server passes the
  resolved dictionary as a prop and server-built children flow through
  the client provider unchanged.

**Accepted tradeoffs (recorded):**
- **SEO**: no per-language URLs → no hreflang, no per-language indexing.
  Accepted — the studio's discovery surface is not SEO-driven today.
- **Static prerendering**: reading the cookie in the root layout makes
  page routes dynamic server-rendered. Accepted — Vercel free tier
  handles it, and it is inherent to serving two locales from one URL
  without client-side copy swapping.

**Rationale for hand-rolled**: App-Router-native (cookies + middleware +
server components), zero new dependencies, no middleware rewrite
complexity, and the pure detection core is unit-testable in isolation.

## D-022 — Dictionaries: en.ts/es.ts with compile-time key parity

**Context:** Splitting `content/site.ts` into per-locale dictionaries
must not break the ~20 existing consumers, and Spanish must not be able
to drift from the English key set.

**Decision:**
- `content/dictionaries/types.ts` holds every content interface plus the
  aggregate `Dictionary` shape; `en.ts` and `es.ts` both implement it,
  so a missing or mistyped key in EITHER language is a compile error.
- `content/site.ts` is now a **barrel**: it re-exports the English
  consts (identical names/shapes — zero consumer changes), the types,
  `locales`/`Locale`, `getDictionary(locale)`, and `CONTACT_EMAIL`.
- `es.ts` ships as a typed stub with values **identical to English**,
  section-marked `// TODO(content): translate`. Translating later =
  editing `es.ts` only, one section at a time, with the type system as
  the safety net.
- `CONTACT_EMAIL` and the mailto contract live in
  `dictionaries/shared.ts` — single-sourced, locale-independent, never
  duplicated.
- Pages are NOT refactored in this phase: they keep importing from the
  barrel; the provider/context exists for future client components.
