"use client";

import { useId, useState } from "react";
import { labelerCopy, labelerFormCopy } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * ApplyForm — client-side application form for /api/apply (D-010).
 *
 * Rendered by ApplyCTA (server) ONLY when Supabase is enabled. Posts
 * fetch() to /api/apply with { type, name, email, message } and handles
 * the three outcomes: loading, success (confirmation copy), failure
 * (always offers the mailto fallback from labelerCopy so the applicant
 * always has an out — state C of the D-010 contract).
 *
 * Accessibility: real <label htmlFor>, aria-invalid + aria-describedby
 * for field errors, role="status"/"alert" regions for form-level states,
 * all interactive elements are native and keyboard-safe.
 */

export type ApplyType = "company" | "professional";

type FormState = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "w-full border border-ink bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-accent";

export function ApplyForm({ type }: { type: ApplyType }) {
  const id = useId();
  const copy = labelerFormCopy;
  const mailtoHref =
    (type === "company" ? labelerCopy.forCompanies : labelerCopy.forProfessionals)
      .cta.href;

  const [state, setState] = useState<FormState>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("submitting");
    setFieldErrors({});
    setFormError(null);

    let response: Response;
    let payload: { ok?: boolean; error?: string; fields?: Record<string, string> };
    try {
      response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        }),
      });
      payload = (await response.json()) as typeof payload;
    } catch {
      // Network-level failure — same recovery path as a 502.
      setState("error");
      return;
    }

    if (response.ok && payload.ok) {
      setState("success");
      return;
    }

    if (response.status === 422 && payload.fields) {
      setFieldErrors(payload.fields);
      setState("idle");
      return;
    }

    setFormError(payload.error ?? "unknown");
    setState("error");
  }

  if (state === "success") {
    return (
      <div role="status" data-apply-success>
        <p className="font-mono text-meta uppercase tracking-wide text-accent">
          {copy.success.heading}
        </p>
        <p className="mt-2 max-w-prose text-base">{copy.success.body}</p>
      </div>
    );
  }

  const errorId = (field: string) =>
    fieldErrors[field] ? `${id}-${field}-error` : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate data-apply-form>
      <input type="hidden" name="type" value={type} />

      <div className="grid gap-6">
        <div>
          <label
            htmlFor={`${id}-name`}
            className="mb-2 block font-mono text-meta uppercase tracking-wide"
          >
            {copy.labels.name}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={200}
            placeholder={copy.placeholders.name}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={errorId("name")}
            className={FIELD_CLASS}
          />
          {fieldErrors.name && (
            <p id={`${id}-name-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
              {copy.fieldErrorRequired} {copy.labels.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${id}-email`}
            className="mb-2 block font-mono text-meta uppercase tracking-wide"
          >
            {copy.labels.email}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            placeholder={copy.placeholders.email}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={errorId("email")}
            className={FIELD_CLASS}
          />
          {fieldErrors.email && (
            <p id={`${id}-email-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
              {fieldErrors.email === "invalid"
                ? copy.invalidEmail
                : `${copy.fieldErrorRequired} ${copy.labels.email}`}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${id}-message`}
            className="mb-2 block font-mono text-meta uppercase tracking-wide"
          >
            {copy.labels.message}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            required
            maxLength={5000}
            rows={5}
            placeholder={copy.placeholders.message}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={errorId("message")}
            className={FIELD_CLASS}
          />
          {fieldErrors.message && (
            <p id={`${id}-message-error`} role="alert" className="mt-2 font-mono text-meta text-accent">
              {copy.fieldErrorRequired} {copy.labels.message}
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
            href={mailtoHref}
            className="mt-2 inline-block font-mono text-meta uppercase tracking-wide text-accent underline underline-offset-4"
          >
            {copy.failure.fallbackLabel}
          </a>
          {formError && (
            <p className="mt-2 font-mono text-meta text-gray-600">
              ref: {formError}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
