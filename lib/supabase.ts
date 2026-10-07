/**
 * lib/supabase.ts — feature-flag detection for optional Supabase backing.
 *
 * The site must build and run with NO environment variables at all.
 * The /api/apply route (owned by another agent) reads env directly; this
 * helper exists purely to detect whether Supabase is configured, safely.
 */

export function isSupabaseEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
