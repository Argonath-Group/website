-- 0002_inquiries (D-026)
--
-- Generalized intake table superseding the Labeler-only
-- `labeler_applications` (migration 0001). Per D-020/D-026, 0001 is
-- PRESERVED for history — the old table stays; a later migration may
-- drop it once existing applications are migrated or reviewed.
--
-- RLS contract: anon may INSERT only with consent = true AND status
-- 'new'; anon has NO select/update/delete. Reads happen out-of-band
-- (dashboard / service key).

create table public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  intent      text not null check (intent in (
                'akita_waitlist',
                'akita_partnership',
                'project_collaboration',
                'press',
                'general',
                'labeler_company',
                'labeler_professional'
              )),
  name        text,
  email       text not null,
  org         text,
  message     text,
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'new' check (status in (
                'new', 'reviewed', 'accepted', 'rejected'
              )),
  reviewed_at timestamptz,
  consent     boolean not null default false,
  ip_hash     text,
  user_agent  text,
  source      text not null default 'website' check (source in (
                'website', 'akita-app', 'labeler-app'
              ))
);

create index inquiries_status_idx on public.inquiries (status);
create index inquiries_intent_idx on public.inquiries (intent);
create index inquiries_created_at_idx on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

create policy "anon can insert inquiries with consent"
  on public.inquiries
  for insert
  to anon
  with check (consent = true and status = 'new');
