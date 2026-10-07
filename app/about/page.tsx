import type { Metadata } from "next";
import { aboutCopy } from "@/content/site";
import type { Founder } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Prose } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "About",
  description: aboutCopy.positioning,
};

/**
 * FounderCard — typographic portrait, no photography. Oversized initials
 * set in display type inside a hairline frame carry the presence a photo
 * would; name, role, and bio sit beneath in the standard hierarchy.
 */
function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  const initials = founder.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Bios ship as "TODO(content)" stubs until real copy arrives — say so
  // on the page instead of printing the marker as prose.
  const bioMissing = founder.bio.trim().startsWith("TODO");

  return (
    <Reveal delay={index * 120}>
      <article className={index % 2 === 1 ? "md:mt-20" : ""}>
        {/* Typographic portrait */}
        <div
          aria-hidden="true"
          className="flex aspect-square items-center justify-center border border-gray-200 bg-gray-100"
        >
          <span className="font-display text-[clamp(6rem,14vw,11rem)] leading-none tracking-tight text-ink">
            {initials}
            <span className="text-accent">.</span>
          </span>
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-title text-ink">{founder.name}</h3>
          <p className="shrink-0 font-mono text-meta uppercase tracking-wide text-gray-500">
            {founder.role}
          </p>
        </div>

        {bioMissing ? (
          <p className="mt-4 border-l-2 border-dashed border-gray-300 pl-4 font-mono text-meta leading-relaxed text-gray-500">
            {"// TODO(content)"} — bio forthcoming.
          </p>
        ) : (
          <Prose className="mt-4">
            <p>{founder.bio}</p>
          </Prose>
        )}
      </article>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <main>
      {/* Positioning — the studio in one paragraph, set as a statement. */}
      <Section className="border-b border-gray-200 pb-16 md:pb-24">
        <Container>
          <Reveal>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              About — Argonath Group
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-10 max-w-4xl font-display text-display-2 text-ink">
              An independent R&amp;D studio.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-10 max-w-2xl md:ml-[12.5%]">
              <Prose className="text-body-lg">
                <p>{aboutCopy.positioning}</p>
              </Prose>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* R&D thesis — the current focus, not the studio's limit. */}
      <Section className="border-b border-gray-200">
        <Container>
          <Reveal>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              Thesis
            </p>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="mt-10 max-w-4xl border-l-2 border-accent pl-6 md:pl-10">
              <p className="font-display text-display-3 text-ink">
                {aboutCopy.thesis}
              </p>
              <footer className="mt-6 font-mono text-meta uppercase tracking-wide text-gray-500">
                Current focus: visual language — not the limit of the work.
              </footer>
            </blockquote>
          </Reveal>
        </Container>
      </Section>

      {/* Founders */}
      <Section>
        <Container>
          <Reveal>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              Cofounders
            </p>
          </Reveal>
          <div className="mt-12 grid gap-16 md:grid-cols-2 md:gap-12">
            {aboutCopy.founders.map((founder, i) => (
              <FounderCard key={founder.name} founder={founder} index={i} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
