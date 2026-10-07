import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseEnabled } from "@/lib/supabase";

/**
 * app/api/apply/route.ts — POST endpoint for Labeler applications (D-010).
 *
 * Three states (see DECISIONS.md):
 *  A. Supabase NOT configured        → GET and POST return 404 JSON.
 *  B. Configured + valid env         → validate, insert into
 *     `labeler_applications`, return { ok: true }.
 *  C. Configured + malformed env     → every failure (bad URL, rejected
 *     key, network error, unexpected throw) is caught and returned as
 *     502 JSON { ok: false, error }. This route NEVER throws — the client
 *     always gets JSON and can fall back to the mailto link.
 *
 * `dynamic = "force-dynamic"`: the flag and env are read per request, so
 * the response must never be cached at the route level.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TABLE = "labeler_applications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status });

const notFound = () => json({ ok: false, error: "Not found" }, 404);

interface ApplicationInput {
  type: "company" | "professional";
  name: string;
  email: string;
  message: string;
}

/**
 * Hand-rolled validation (D-010: no zod, no new validation dep).
 * Returns a cleaned input, or an object of field-level errors.
 */
function validate(body: unknown):
  | { ok: true; value: ApplicationInput }
  | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, unknown>;

  const rawType = b.type;
  const type: "company" | "professional" | null =
    rawType === "professional" ? "professional" : rawType === "company" ? "company" : null;
  if (type === null) errors.type = "invalid";

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) errors.name = "required";
  else if (name.length > 200) errors.name = "too_long";

  const email = typeof b.email === "string" ? b.email.trim() : "";
  if (!email) errors.email = "required";
  else if (email.length > 320 || !EMAIL_RE.test(email)) errors.email = "invalid";

  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message) errors.message = "required";
  else if (message.length > 5000) errors.message = "too_long";

  if (type === null || Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, value: { type, name, email, message } };
}

/** Wrap env access + client creation: any malformed-env throw is caught by callers. */
function insertApplication(input: ApplicationInput) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase env missing");

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabase.from(TABLE).insert({
    type: input.type,
    name: input.name,
    email: input.email,
    message: input.message,
    created_at: new Date().toISOString(),
  });
}

export async function GET() {
  return notFound();
}

export async function POST(request: Request) {
  try {
    // State A — feature off: behave as if the route does not exist.
    if (!isSupabaseEnabled()) return notFound();

    // Body must be JSON; a parse failure is a client error, not a crash.
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400);
    }

    const checked = validate(rawBody);
    if (!checked.ok) {
      return json({ ok: false, error: "Validation failed", fields: checked.errors }, 422);
    }

    // States B/C — insert. Supabase "errors" (bad URL, 401 from a wrong
    // key, RLS denial, missing table) all surface as a rejected result or
    // a thrown exception; both paths become a 502 the form can recover from.
    let result;
    try {
      result = await insertApplication(checked.value);
    } catch (cause) {
      console.error("[/api/apply] unexpected error during insert:", cause);
      return json({ ok: false, error: "Application storage failed" }, 502);
    }

    if (result.error) {
      console.error("[/api/apply] supabase error:", result.error.message);
      return json({ ok: false, error: "Application storage failed" }, 502);
    }

    return json({ ok: true }, 200);
  } catch (cause) {
    // Last-resort catch: the route never crashes with a 500 HTML page.
    console.error("[/api/apply] unhandled exception:", cause);
    return json({ ok: false, error: "Unexpected server error" }, 502);
  }
}
