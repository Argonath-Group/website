# Argonath Group — website

The studio site for Argonath Group, an independent R&D studio working
across visual technology, computational design, and experimental digital
experiences. Built with Next.js 16 (App Router) + TypeScript + Tailwind
CSS v4. All copy lives in `content/site.ts`; the site builds and runs
with **zero environment variables**.

## Commands

```bash
npm install        # install deps (npm, Node >= 22)
npm run dev        # dev server
npm run build      # production build (no .env needed)
npm run start      # serve the production build
npm run lint       # eslint (flat config, next presets)
npm run typecheck  # tsc --noEmit, strict
```

## Supabase (optional)

Supabase backs the Labeler application form (`/api/apply`) behind a
feature flag (`lib/supabase.ts`). With no env vars the route returns 404
and the site renders mailto CTAs instead — nothing breaks.

To enable: set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. Schema is managed by migrations in
`supabase/migrations/` — **GitHub is the source of truth; never edit
schema in the dashboard** (changes will be overwritten by the next push).

- **On merge to main** (paths `supabase/**`), `.github/workflows/migrations.yml`
  links and runs `supabase db push` automatically.
- **Required repository secrets:** `SUPABASE_ACCESS_TOKEN` and
  `SUPABASE_PROJECT_REF`.
- **Local development** (needs Docker): `npx supabase@2.120.0 start`
  gives you local Postgres + API; `supabase db reset` applies migrations
  then `supabase/seed.sql`. Get local credentials with `supabase status`.
- The CLI is pinned at **v2.120.0** and is not a package.json dependency
  (see D-018); use `npx supabase@2.120.0 ...` locally.

## Workflow (trunk-based)

Short-lived branches off `main`, pull request, CI gates every PR
(typecheck, lint, no-env build, migration sanity), migrations push on
merge. Schema changes are append-only migrations — never rewrite an old
one; add the next number.
