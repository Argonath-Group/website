"use client";

import { useId, useState } from "react";
import { track } from "@vercel/analytics";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  inquiryFormCopy,
  mailtoSubjects,
  websiteIntents,
  type Intent,
  type PartnershipType,
  type WebsiteIntent,
} from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * InquireForm — client-side intake form for /api/inquire (D-026/D-027).
 *
 * Two modes:
 *  - `intent` prop set (from InquireCTA): the intent is LOCKED — no
 *    dropdown, shown as a labeled chip.
 *  - `intent` undefined (contact page): dropdown of the five website
 *    intents; akita_partnership reveals the conditional payload fields.
 *
 * States: submitting / success (role="status") / failure (role="alert" +
 * mailto fallback — the applicant always has an out). A 404 response
 * (flag turned off between render and submit) degrades to the same
 * failure state with the mailto link.
 *
 * Accessibility: real <label htmlFor>, aria-invalid + aria-describedby on
 * every field, error text associated by id, native keyboard-safe controls.
 * The honeypot is moved off-screen (not display:none, which some bots
 * detect) and is never keyboard-focusable.
 */

type FormState = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full border border-ink bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-accent";

function buildMailto(intent: Intent): string {
  const subject = mailtoSubjects[intent].replace(/ /g, "%20");
  return `mailto:${CONTACT_EMAIL}?subject=${subject}`;
}

export function InquireForm({ intent }: { intent?: Intent }) {
  const id = useId();
  const copy = inquiryFormCopy;

  const [selectedIntent, setSelectedIntent] = useState<WebsiteIntent>(
    (intent as WebsiteIntent | undefined) ?? "general"
  );
  const [state, setState] = useState<FormState>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const effectiveIntent: Intent = intent ?? selectedIntent;
  const fallbackHref = buildMailto(effectiveIntent);
  const showPartnershipFields = effectiveIntent === "akita_partnership";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("submitting");
    setFieldErrors({});
    setFormError(null);
    track("cta_click", { intent: effectiveIntent });

    const payload =
      effectiveIntent === "akita_partnership"
        ? {
            partnership_type: String(data.get("partnership_type") ?? ""),
            links: String(data.get("links") ?? ""),
            timeline: String(data.get("timeline") ?? ""),
          }
        : undefined;

    let response: Response;
    let payload_json: { ok?: boolean; error?: string; fields?: Record<string, string> };
    try {
      response = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: effectiveIntent,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          org: String(data.get("org") ?? ""),
          message: String(data.get("message") ?? ""),
          consent: data.get("consent") === "on",
          source: "website",
          ...(payload ? { payload } : {}),
        }),
      });
      payload_json = (await response.json()) as typeof payload_json;
    } catch {
      setState("error");
      return;
    }

    if (response.ok && payload_json.ok) {
      track("inquiry_submitted", { intent: effectiveIntent });
      setState("success");
      return;
    }

    if (response.status === 422 && payload_json.fields) {
      setFieldErrors(payload_json.fields);
      setState("idle");
      return;
    }

    // 404 (flag-off race) or 502 (state C): same recovery path — mailto.
    setFormError(payload_json.error ?? "unknown");
    setState("error");
  }

  if (state === "success") {
    return (
      <div role="status" data-inquire-success>
        <p className="font-mono text-meta uppercase tracking-wide text-accent">
          {copy.success.heading}
        </p>
        <p className="mt-2 max-w-prose text-base">{copy.success.body}</p>
      </div>
    );
  }

  const err = (field: string) => fieldErrors[field];
  const errId = (field: string) => (err(field) ? `${id}-${field}-error` : undefined);
  const errText = (field: string, fallback: string) => {
    const e = err(field);
    if (!e) return null;
    if (e === "invalid" && field === "email") return copy.errors.invalidEmail;
    if (e === "invalid" && field === "links") return copy.errors.invalidUrl;
    if (e === "invalid" && field === "intent") return copy.errors.invalidIntent;
    return fallback;
  };
  const fieldShell = (
    field: string,
    label: string,
    control: React.ReactNode,
    fallbackError: string
  ) => (
    <div>
      <label
        htmlFor={`${id}-${field}`}
        className="mb-2 block font-mono text-meta uppercase tracking-wide"
      >
        {label}
      </label>
      {control}
      {err(field) && (
        <p id={`${id}-${field}-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
          {errText(field, fallbackError)}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate data-inquire-form>
      {/* Honeypot — off-screen, unfocusable, aria-hidden. Filled ⇒ bot. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-website`}>{copy.honeypotLabel}</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6">
        {intent ? (
          <div>
            <span className="mb-2 block font-mono text-meta uppercase tracking-wide">
              {copy.lockedIntentLabel}
            </span>
            <span
              data-inquire-intent-chip
              className="inline-flex items-center border border-ink px-2.5 py-1 font-mono text-meta uppercase tracking-wide"
            >
              {mailtoSubjects[effectiveIntent]}
            </span>
          </div>
        ) : (
          <div>
            <label
              htmlFor={`${id}-intent`}
              className="mb-2 block font-mono text-meta uppercase tracking-wide"
            >
              {copy.labels.intent}
            </label>
            <select
              id={`${id}-intent`}
              name="intent"
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value as WebsiteIntent)}
              aria-invalid={Boolean(err("intent"))}
              aria-describedby={errId("intent")}
              className={FIELD_CLASS}
            >
              {websiteIntents.map((i) => (
                <option key={i} value={i}>
                  {copy.intentOptions[i]}
                </option>
              ))}
            </select>
            {err("intent") && (
              <p id={`${id}-intent-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
                {copy.errors.invalidIntent}
              </p>
            )}
          </div>
        )}

        {fieldShell(
          "name",
          copy.labels.name,
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={200}
            placeholder={copy.placeholders.name}
            aria-invalid={Boolean(err("name"))}
            aria-describedby={errId("name")}
            className={FIELD_CLASS}
          />,
          copy.errors.required
        )}

        {fieldShell(
          "email",
          copy.labels.email,
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            placeholder={copy.placeholders.email}
            aria-invalid={Boolean(err("email"))}
            aria-describedby={errId("email")}
            className={FIELD_CLASS}
          />,
          copy.errors.required
        )}

        {fieldShell(
          "org",
          copy.labels.org,
          <input
            id={`${id}-org`}
            name="org"
            type="text"
            autoComplete="organization"
            maxLength={200}
            placeholder={copy.placeholders.org}
            aria-invalid={Boolean(err("org"))}
            aria-describedby={errId("org")}
            className={FIELD_CLASS}
          />,
          copy.errors.required
        )}

        {showPartnershipFields && (
          <>
            <div>
              <label
                htmlFor={`${id}-partnership_type`}
                className="mb-2 block font-mono text-meta uppercase tracking-wide"
              >
                {copy.labels.partnershipType}
              </label>
              <select
                id={`${id}-partnership_type`}
                name="partnership_type"
                required
                aria-invalid={Boolean(err("payload.partnership_type"))}
                aria-describedby={errId("payload.partnership_type")}
                className={FIELD_CLASS}
              >
                <option value="" disabled selected hidden>
                  {copy.labels.partnershipType}
                </option>
                {(Object.keys(copy.partnershipTypeOptions) as PartnershipType[]).map((t) => (
                  <option key={t} value={t}>
                    {copy.partnershipTypeOptions[t]}
                  </option>
                ))}
              </select>
              {err("payload.partnership_type") && (
                <p id={`${id}-payload.partnership_type-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
                  {copy.errors.required}
                </p>
              )}
            </div>

            {fieldShell(
              "links",
              copy.labels.links,
              <input
                id={`${id}-links`}
                name="links"
                type="url"
                inputMode="url"
                maxLength={1000}
                placeholder={copy.placeholders.links}
                aria-invalid={Boolean(err("links"))}
                aria-describedby={errId("links")}
                className={FIELD_CLASS}
              />,
              copy.errors.required
            )}

            {fieldShell(
              "timeline",
              copy.labels.timeline,
              <input
                id={`${id}-timeline`}
                name="timeline"
                type="text"
                maxLength={300}
                placeholder={copy.placeholders.timeline}
                aria-invalid={Boolean(err("timeline"))}
                aria-describedby={errId("timeline")}
                className={FIELD_CLASS}
              />,
              copy.errors.required
            )}
          </>
        )}

        {fieldShell(
          "message",
          copy.labels.message,
          <textarea
            id={`${id}-message`}
            name="message"
            required
            maxLength={5000}
            rows={5}
            placeholder={copy.placeholders.message}
            aria-invalid={Boolean(err("message"))}
            aria-describedby={errId("message")}
            className={FIELD_CLASS}
          />,
          copy.errors.required
        )}

        <div>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-consent`}
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(err("consent"))}
              aria-describedby={errId("consent")}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <label htmlFor={`${id}-consent`} className="text-sm text-gray-700">
              {copy.privacy.note}{" "}
              <Link href="/privacy" className="text-accent underline underline-offset-4">
                {copy.privacy.linkLabel}
              </Link>
            </label>
          </div>
          {err("consent") && (
            <p id={`${id}-consent-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
              {copy.errors.consentRequired}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary" disabled={state === "submitting"}>
          {state === "submitting" ? copy.submittingLabel : copy.submitLabel}
        </Button>
      </div>

      {state === "error" && (
        <div role="alert" className="mt-6 border border-accent p-4">
          <p className="font-mono text-meta uppercase tracking-wide text-accent">
            {copy.failure.heading}
          </p>
          <p className="mt-2 text-base">{copy.failure.body}</p>
          <a
            href={fallbackHref}
            className="mt-2 inline-block font-mono text-meta uppercase tracking-wide text-accent underline underline-offset-4"
          >
            {copy.failure.fallbackLabel}
          </a>
          {formError && (
            <p className="mt-2 font-mono text-meta text-gray-600">ref: {formError}</p>
          )}
        </div>
      )}
    </form>
  );
}
