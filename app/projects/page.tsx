import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { projectEntries, projectsIndex } from "@/content/site";

export const metadata: Metadata = {
  title: projectsIndex.heading,
  description: projectsIndex.intro,
};

/**
 * /projects — the studio's project archive (D-023), not a SaaS grid.
 *
 * Same editorial bones as the former /work index: numbered archive rows
 * with a table rhythm (hairline rules, mono metadata, one large
 * typographic gesture per row). Reframed Argonath-first: Akita leads as
 * the flagship coming-soon project, Labeler sits in the index as an
 * in-development entry with NO page (href "" renders the row unlinked),
 * the seeded research/experiment entries keep their detail pages under
 * /projects/[slug].
 */
export default function ProjectsPage() {
  return (
    <main>
      {/* Archive header — asymmetric: oversized display type on the left,
          intro statement pushed to the right column. */}
      <Section className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <Reveal>
                <p className="mb-6 font-mono text-meta uppercase tracking-wide text-gray-500">
                  {projectsIndex.kicker}
                </p>
                <h1 className="font-display text-display-1">
                  {projectsIndex.heading}
                </h1>
              </Reveal>
            </div>
            <div className="flex items-end md:col-span-4 md:col-start-9">
              <Reveal delay={120}>
                <p className="text-body-lg text-gray-600">
                  {projectsIndex.intro}
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* The index — archive-table rhythm: a heavy top rule, mono column
          labels, hairline row separators. Each row is one entry, not a
          card. Entries with an empty href (Labeler, D-023) render as
          unlinked rows. */}
      <Section className="pt-0">
        <Container>
          <div className="border-t-2 border-ink">
            {/* Column labels — instrument readout register. */}
            <div
              aria-hidden
              className="grid grid-cols-12 gap-4 border-b border-gray-300 py-4 font-mono text-meta uppercase tracking-wide text-gray-500"
            >
              <span className="col-span-2 md:col-span-1">No.</span>
              <span className="col-span-6 md:col-span-6">Entry</span>
              <span className="hidden md:col-span-3 md:block">Status</span>
              <span className="col-span-4 text-right md:col-span-2">Year</span>
            </div>

            {projectEntries.map((entry, i) => {
              const inner = (
                <>
                  <span className="col-span-2 font-mono text-meta text-gray-500 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 md:col-span-6">
                    <span
                      className={`block font-display text-display-3 tracking-[-0.02em] ${
                        entry.href
                          ? "transition-colors duration-200 group-hover:text-accent"
                          : ""
                      }`}
                    >
                      {entry.name}
                    </span>
                    <span className="mt-3 block max-w-md text-body text-gray-600">
                      {entry.oneLiner}
                    </span>
                    <span className="mt-4 block md:hidden">
                      <Tag status={entry.status} kind={entry.kind} />
                    </span>
                  </span>
                  <span className="hidden md:col-span-3 md:block">
                    <Tag status={entry.status} kind={entry.kind} />
                  </span>
                  <span className="col-span-12 mt-4 flex items-baseline justify-between font-mono text-meta uppercase tracking-wide text-gray-500 md:col-span-2 md:mt-0 md:justify-end md:gap-6">
                    {entry.year}
                    <span
                      aria-hidden
                      className={`text-gray-400 transition-all duration-200 ${
                        entry.href
                          ? "group-hover:translate-x-1 group-hover:text-accent"
                          : ""
                      }`}
                    >
                      →
                    </span>
                  </span>
                </>
              );
              const rowClass =
                "group -mx-4 grid grid-cols-12 items-baseline gap-4 border-b border-gray-300 px-4 py-10 md:-mx-6 md:px-6 md:py-14";
              return (
                <Reveal key={entry.slug} delay={i * 70}>
                  {entry.href ? (
                    <Link
                      href={entry.href}
                      className={`${rowClass} transition-colors duration-200 hover:bg-gray-100`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className={rowClass}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          {/* Index footnote — the archive is open-ended. */}
          <Reveal delay={projectEntries.length * 70}>
            <p className="mt-10 font-mono text-meta uppercase tracking-wide text-gray-500">
              {projectEntries.length} entries — index open
            </p>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
