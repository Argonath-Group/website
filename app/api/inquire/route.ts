import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseEnabled } from "@/lib/supabase";
import {
  CONTACT_EMAIL,
  inquiryFormCopy,
  inquiryIntents,
  inquirySources,
  mailtoSubjects,
  partnershipTypes,
  type InquirySource,
  type Intent,
  type PartnershipType,
} from "@/content/site";

/**
 * app/api/inquire/route.ts — generalized intake endpoint (D-026).
 * Supersedes /api/apply (deleted in D-027); inserts into `inquiries`.
 *
 * Three states (same contract as D-010):
 *  A. Supabase NOT configured        → GET and POST return 404 JSON.
 *  B. Configured + valid env         → validate, insert, { ok: true }.
 *  C. Configured + malformed env     → every failure (bad URL, rejected
 *     key, RLS denial, missing table, Resend outage) is caught and
 *     returned as 502 JSON. This route NEVER throws — the client always
 *     gets JSON and can fall back to the mailto link.
 *
 * Privacy: the raw client IP is NEVER stored. We store a sha256 hash,
 * salted with the anon key (falling back to a constant pepper) so the
 * hash is useless for tracking across deployments but still lets us
 * detect duplicate bursts.
 *
 * `dynamic = "force-dynamic"`: flag and env are read per request.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TABLE = "inquiries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/i;
const NAME_OPTIONAL_INTENTS = new Set<Intent>(["general"]);

const json = (body: Record<string, unknown>, status: number) =>
  NextResponse.json(body, { status });
const notFound = () => json({ ok: false, error: "Not found" }, 404);

interface Payload {
  partnership_type?: PartnershipType;
  links?: string;
  timeline?: string;
}

interface InquiryInput {
  intent: Intent;
  name: string | null;
  email: string;
  org: string | null;
  message: string;
  payload: Payload;
  consent: boolean;
  user_agent: string | null;
  source: InquirySource;
  ip_hash: string | null;
}

type Validation =
  | { ok: true; value: InquiryInput; honeypot: boolean }
  | { ok: false; errors: Record<string, string> };

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function validate(body: unknown): Validation {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, unknown>;

  // Honeypot: bots fill this decoy field; humans never see it. We don't
  // reject loudly (that confirms the endpoint is real) — we pretend
  // success and skip the insert.
  const honeypot = asString(b.website).length > 0;

  const intent = inquiryIntents.find((i) => i === b.intent);
  if (!intent) errors.intent = "invalid";

  const email = asString(b.email);
  if (!email) errors.email = "required";
  else if (email.length > 320 || !EMAIL_RE.test(email)) errors.email = "invalid";

  const name = asString(b.name);
  if (!name && intent && !NAME_OPTIONAL_INTENTS.has(intent)) errors.name = "required";
  else if (name.length > 200) errors.name = "too_long";

  const org = asString(b.org);
  if (org.length > 200) errors.org = "too_long";

  const message = asString(b.message);
  if (!message) errors.message = "required";
  else if (message.length > 5000) errors.message = "too_long";

  const consent = b.consent === true || b.consent === "true" || b.consent === "on";
  if (!consent) errors.consent = "required";

  // Conditional per-intent payload fields.
  const rawPayload = (b.payload ?? {}) as Record<string, unknown>;
  const payload: Payload = {};
  if (intent === "akita_partnership") {
    const pt = partnershipTypes.find((t) => t === rawPayload.partnership_type);
    if (!pt) errors["payload.partnership_type"] = "required";
    else payload.partnership_type = pt;

    const links = asString(rawPayload.links);
    if (!links) errors["payload.links"] = "required";
    else if (links.length > 1000 || !URL_RE.test(links)) errors["payload.links"] = "invalid";
    else payload.links = links;

    const timeline = asString(rawPayload.timeline);
    if (timeline.length > 300) errors["payload.timeline"] = "too_long";
    else if (timeline) payload.timeline = timeline;
  }

  const source = inquirySources.find((s) => s === b.source) ?? "website";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    honeypot,
    value: {
      intent: intent as Intent,
      name: name || null,
      email,
      org: org || null,
      message,
      payload,
      consent: true,
      source,
      // Filled in by the caller (needs the Request object).
      user_agent: null,
      ip_hash: null,
    },
  };
}

/** sha256 of the client IP, salted — raw IPs are never persisted (D-026). */
function hashIp(request: Request): string | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip");
  if (!ip) return null;
  const salt = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "argonath-inquiries-pepper";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function insertInquiry(input: InquiryInput) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase env missing");

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabase.from(TABLE).insert({
    intent: input.intent,
    name: input.name,
    email: input.email,
    org: input.org,
    message: input.message,
    payload: input.payload,
    consent: input.consent,
    user_agent: input.user_agent,
    ip_hash: input.ip_hash,
    source: input.source,
  });
}

/**
 * D-028 — flag-gated Resend notifications, strictly isolated: any
 * failure here is logged and swallowed; the insert already succeeded so
 * the request must not fail. Dynamic import keeps the module (and its
 * dependency) out of the request path when the flag is off.
 */
async function notifyInquiry(input: InquiryInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[/api/inquire] RESEND_API_KEY unset — skipping notifications");
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM ?? "notifications@argonathgroup.com";
    const subject = mailtoSubjects[input.intent];

    // (a) Notification to the studio.
    await resend.emails.send({
      from,
      to: CONTACT_EMAIL,
      subject: `[Inquiry] ${subject} — ${input.name ?? input.email}`,
      text: [
        `Intent: ${input.intent}`,
        `Name: ${input.name ?? "—"}`,
        `Email: ${input.email}`,
        `Org: ${input.org ?? "—"}`,
        `Source: ${input.source}`,
        "",
        input.message,
      ].join("\n"),
    });

    // (b) Confirmation to the applicant (template copy from the dictionary).
    await resend.emails.send({
      from,
      to: input.email,
      subject: subject,
      text: `${inquiryFormCopy.success.heading}\n\n${inquiryFormCopy.success.body}\n\n— Argonath Group`,
    });
  } catch (cause) {
    console.error("[/api/inquire] notification failed (non-fatal):", cause);
  }
}

export async function GET() {
  return notFound();
}

export async function POST(request: Request) {
  try {
    // State A — feature off: behave as if the route does not exist.
    if (!isSupabaseEnabled()) return notFound();

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

    // Honeypot trip: smile, nod, store nothing.
    if (checked.honeypot) return json({ ok: true }, 200);

    const input = checked.value;
    input.user_agent = (request.headers.get("user-agent") ?? "").slice(0, 300) || null;
    input.ip_hash = hashIp(request);

    // States B/C — insert. Every failure becomes a 502 the form recovers from.
    let result;
    try {
      result = await insertInquiry(input);
    } catch (cause) {
      console.error("[/api/inquire] unexpected error during insert:", cause);
      return json({ ok: false, error: "Inquiry storage failed" }, 502);
    }

    if (result.error) {
      console.error("[/api/inquire] supabase error:", result.error.message);
      return json({ ok: false, error: "Inquiry storage failed" }, 502);
    }

    // D-028: awaited but fire-and-forget — it can never fail the request.
    await notifyInquiry(input);

    return json({ ok: true }, 200);
  } catch (cause) {
    // Last-resort catch: the route never crashes with a 500 HTML page.
    console.error("[/api/inquire] unhandled exception:", cause);
    return json({ ok: false, error: "Unexpected server error" }, 502);
  }
}
