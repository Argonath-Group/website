"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/content/site";

/**
 * LocaleToggle — the EN/ES switch (D-021). Small client component; the
 * server layout passes the ACTIVE locale as a prop (the toggle never
 * reads cookies itself, so it stays a light client leaf).
 *
 * Behavior: POSTs the choice to /api/locale (sets the persistent
 * cookie), then router.refresh() re-renders the server tree under the
 * new locale. Two real <button>s — full keyboard support comes free,
 * aria-pressed communicates the active locale to assistive tech.
 */
export function LocaleToggle({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function switchLocale(next: Locale) {
    if (next === locale || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPending(false);
    }
  }

  const base =
    "min-h-11 px-2 font-mono text-meta uppercase tracking-wide transition-colors";
  const active = "text-accent";
  const inactive = "text-gray-600 hover:text-ink";

  return (
    <div
      className={`flex items-center gap-1 ${className}`.trim()}
      role="group"
      aria-label="Language / Idioma"
    >
      {(["en", "es"] as const).map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="font-mono text-meta text-gray-400">
              /
            </span>
          )}
          <button
            type="button"
            aria-pressed={locale === code}
            disabled={pending}
            onClick={() => switchLocale(code)}
            className={`${base} ${locale === code ? active : inactive}`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
