import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { Prose } from "@/components/ui/Prose";
import { LinkButton } from "@/components/ui/Button";
import { akitaCopy, workEntries, CONTACT_EMAIL } from "@/content/site";

function requireWorkEntry(slug: string) {
  const entry = workEntries.find((e) => e.slug === slug);
  if (!entry) throw new Error(`content/site.ts is missing the ${slug} work entry`);
  return entry;
}

const akita = requireWorkEntry("akita");

export const metadata: Metadata = {
  title: akitaCopy.name,
  description: akitaCopy.overview,
};

/**
 * /work/akita — case study via the shared CaseStudy template (D-006).
 * Page owns content only; the template owns breadcrumb, hero, section
 * rhythm, and the footer slot.
 */
export default function AkitaPage() {
  return (
    <CaseStudy
      entry={akita}
      sections={[
        {
          id: "overview",
          title: "Overview",
          children: (
            <Prose>
              <p>{akitaCopy.overview}</p>
            </Prose>
          ),
        },
        {
          id: "what-it-does",
          title: "What it does",
          children: (
            <Prose>
              <ul>
                {akitaCopy.whatItDoes.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </Prose>
          ),
        },
        {
          id: "per-country-adaptivity",
          title: "Per-country adaptivity",
          children: (
            <div>
              {/* The core insight, set large so it lands: most systems
                  ship one fixed thing everywhere — Akita adapts per
                  market while remaining one brand. */}
              <p className="font-display text-display-3 leading-[1.1] tracking-[-0.02em] text-ink">
                {akitaCopy.perCountryAdaptivity}
              </p>
            </div>
          ),
        },
        {
          id: "capabilities",
          title: "Capabilities",
          children: (
            <ul className="border-t border-gray-300">
              {akitaCopy.capabilities.map((capability, i) => (
                <li
                  key={capability}
                  className="flex items-baseline gap-6 border-b border-gray-300 py-5"
                >
                  <span className="font-mono text-meta text-gray-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body text-gray-700">{capability}</span>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "demo",
          title: "Demo",
          children: (
            <div>
              <h3 className="font-display text-title">{akitaCopy.demo.heading}</h3>
              <p className="mt-4 max-w-xl text-body-lg leading-[1.55] text-gray-600">
                {akitaCopy.demo.body}
              </p>
              <div className="mt-8">
                <LinkButton href={akitaCopy.demo.ctaHref} variant="primary">
                  {akitaCopy.demo.ctaLabel}
                </LinkButton>
              </div>
            </div>
          ),
        },
        {
          id: "documentation",
          title: "Documentation",
          children: (
            <div>
              <p className="max-w-xl text-body-lg leading-[1.55] text-gray-600">
                {akitaCopy.documentation.body}
              </p>
              <div className="mt-8">
                <LinkButton
                  href={akitaCopy.documentation.ctaHref}
                  variant="secondary"
                >
                  Open documentation
                </LinkButton>
              </div>
            </div>
          ),
        },
      ]}
      footer={
        <div className="flex flex-col gap-8 border-t border-gray-300 pt-10 md:flex-row md:items-center md:justify-between">
          <LinkButton href="/work" variant="secondary">
            ← All work
          </LinkButton>
          <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
            Inquiries —{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent underline decoration-accent underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      }
    />
  );
}
