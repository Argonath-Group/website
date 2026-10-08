import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { InquireCTA } from "@/components/inquire/InquireCTA";
import { partnersCopy } from "@/content/site";

export const metadata: Metadata = {
  title: partnersCopy.heading,
  description: partnersCopy.intro,
};

/**
 * /partners — first-class partnership page (D-023).
 *
 * Why partner with the studio, who we'd like to hear from (framed as an
 * invitation, not a requirements list — most of this copy is
 * TODO(content)), and what the studio brings. One direct mailto CTA.
 */
export default function PartnersPage() {
  return (
    <main>
      {/* Hero — oversized heading, intro pushed right. */}
      <Section className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <Reveal>
                <h1 className="font-display text-display-1">
                  {partnersCopy.heading}
                </h1>
              </Reveal>
            </div>
            <div className="flex items-end md:col-span-4 md:col-start-9">
              <Reveal delay={120}>
                <p className="text-body-lg text-gray-600">
                  {partnersCopy.intro}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why — the studio's case for partnership. */}
      <Section aria-labelledby="partners-why">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="mb-3 font-mono text-meta text-gray-500">01</p>
                <h2 id="partners-why" className="font-display text-title">
                  {partnersCopy.why.heading}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <p className="max-w-2xl text-body-lg leading-[1.55] text-gray-600">
                  {partnersCopy.why.body}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Who — an invitation, not a requirements list. */}
      <Section aria-labelledby="partners-who">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="mb-3 font-mono text-meta text-gray-500">02</p>
                <h2 id="partners-who" className="font-display text-title">
                  {partnersCopy.who.heading}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <p className="text-body-lg text-gray-600">
                  {partnersCopy.who.intro}
                </p>
                <ul className="mt-6 border-t border-gray-300">
                  {partnersCopy.who.groups.map((group) => (
                    <li
                      key={group}
                      className="border-b border-gray-300 py-5 text-body text-gray-700"
                    >
                      {group}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Offer — what the studio brings. */}
      <Section aria-labelledby="partners-offer">
        <Container>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="mb-3 font-mono text-meta text-gray-500">03</p>
                <h2 id="partners-offer" className="font-display text-title">
                  {partnersCopy.offer.heading}
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={120}>
                <ul className="border-t border-gray-300">
                  {partnersCopy.offer.items.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-6 border-b border-gray-300 py-5"
                    >
                      <span className="font-mono text-meta text-gray-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA — one direct line; mailto while the flag is off, locked-intent
          form when Supabase is enabled (D-027). */}
      <Section aria-labelledby="partners-cta">
        <Container>
          <Reveal>
            <div className="border-t-2 border-ink pt-10">
              <InquireCTA
                intent="project_collaboration"
                label={partnersCopy.cta.label}
                variant="primary"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
