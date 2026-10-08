import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { InquireCTA } from "@/components/inquire/InquireCTA";
import { akitaCopy, projectEntries } from "@/content/site";

function requireProjectEntry(slug: string) {
  const entry = projectEntries.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`content/dictionaries is missing the ${slug} project entry`);
  }
  return entry;
}

const akita = requireProjectEntry("akita");

export const metadata: Metadata = {
  title: `${akitaCopy.name} — coming soon`,
  description: akita.oneLiner,
};

/**
 * /projects/akita — COMING SOON page (D-023), deliberately NOT a case
 * study: Akita is the studio's flagship in-development project, and this
 * page collects waitlist + partnership interest instead of documenting
 * shipped work. Both CTAs are mailto for now; Phase 2 wires the intake
 * form. Ecuador-first / LatAm positioning only — no ASL claims.
 */
export default function AkitaComingSoonPage() {
  return (
    <main>
      {/* Hero — name, in-development tag, one-liner. Breadcrumb back to
          the projects archive. */}
      <Section className="pb-16 md:pb-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-10 md:mb-16">
            <Link
              href="/projects"
              className="font-mono text-meta uppercase tracking-wide text-gray-600 transition-colors hover:text-accent"
            >
              ← Projects
            </Link>
          </nav>

          <div className="flex flex-col gap-6 md:gap-8">
            <Tag status={akita.status} kind={akita.kind} />
            <h1 className="font-display text-display-1">{akitaCopy.name}</h1>
            <p className="max-w-2xl text-body-lg text-gray-600">
              {akita.oneLiner}
            </p>
          </div>
        </Container>
      </Section>

      {/* The per-country insight — the argument of the product, set large
          so it lands. Sign languages are national; Ecuador first. */}
      <Section aria-labelledby="akita-insight">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <h2
                  id="akita-insight"
                  className="font-display text-title"
                >
                  {akitaCopy.insight.heading}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <p className="font-display text-display-3 leading-[1.15] tracking-[-0.02em] text-ink">
                  {akitaCopy.insight.body}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features — short list, ruled like an instrument panel. */}
      <Section aria-labelledby="akita-features">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <h2
                  id="akita-features"
                  className="font-display text-title"
                >
                  {akitaCopy.features.heading}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <ul className="border-t border-gray-300">
                  {akitaCopy.features.items.map((feature, i) => (
                    <li
                      key={feature}
                      className="flex items-baseline gap-6 border-b border-gray-300 py-5"
                    >
                      <span className="font-mono text-meta text-gray-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Waitlist + partnership CTAs — InquireCTA (D-027): mailto while the
          Supabase flag is off, locked-intent intake form when it is on.
          Equal weight: interest from learners and from partners are both
          first-class. */}
      <Section aria-labelledby="akita-cta">
        <Container>
          <Reveal>
            <h2 id="akita-cta" className="sr-only">
              {akitaCopy.waitlistCta.label} / {akitaCopy.partnerCta.label}
            </h2>
            <div className="flex flex-col gap-6 border-t-2 border-ink pt-10 md:flex-row md:items-center md:gap-10">
              <InquireCTA
                intent="akita_waitlist"
                label={akitaCopy.waitlistCta.label}
                variant="primary"
              />
              <InquireCTA
                intent="akita_partnership"
                label={akitaCopy.partnerCta.label}
                variant="secondary"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
