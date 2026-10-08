-- 0001_labeler_applications
--
-- Captures the CURRENT deployed schema for the /api/apply feature flag
-- (D-010, D-020). This migration must never be rewritten; the Phase 2
-- `inquiries` table arrives as a NEW migration (0002+) that supersedes
-- this one. Spec source: content/TODO.md "Required Supabase setup (D-010)".

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
