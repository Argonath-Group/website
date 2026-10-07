import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { workEntries } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "The Argonath Group lab archive — everything we've built, including unfinished things.",
};

/**
 * /work — LAB ARCHIVE, not a SaaS grid (brief §4.2).
 *
 * An editorial index of things made: numbered archive rows with a
 * table rhythm (hairline rules, mono metadata, one large typographic
 * gesture per row), generous negative space, and status Tags that
 * distinguish live products from research and experiments. Explicitly
 * NOT uniform product cards.
 */
export default function WorkPage() {
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
                  Argonath Group — Lab archive
                </p>
                <h1 className="font-display text-display-1">Work</h1>
              </Reveal>
            </div>
            <div className="flex items-end md:col-span-4 md:col-start-9">
              <Reveal delay={120}>
                <p className="text-body-lg text-gray-600">
                  Everything we&apos;ve built — products, research, and
                  experiments. Including the unfinished things.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* The index — archive-table rhythm: a heavy top rule, mono column
          labels, hairline row separators. Each row is one entry, not a
          card. */}
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

            {workEntries.map((entry, i) => (
              <Reveal key={entry.slug} delay={i * 70}>
                <Link
                  href={entry.href}
                  className="group -mx-4 grid grid-cols-12 items-baseline gap-4 border-b border-gray-300 px-4 py-10 transition-colors duration-200 hover:bg-gray-100 md:-mx-6 md:px-6 md:py-14"
                >
                  <span className="col-span-2 font-mono text-meta text-gray-500 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-10 md:col-span-6">
                    <span className="block font-display text-display-3 tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent">
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
                      className="text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-accent"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Index footnote — the archive is open-ended. */}
          <Reveal delay={workEntries.length * 70}>
            <p className="mt-10 font-mono text-meta uppercase tracking-wide text-gray-500">
              {workEntries.length} entries — index open
            </p>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
