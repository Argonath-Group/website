import type { Metadata } from "next";
import Link from "next/link";
import { labEntries, labIdentityLine } from "@/content/site";
import type { LabEntry } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Lab",
  description: labIdentityLine,
};

/** ISO date rendered instrument-style, stable across timezones. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

/**
 * LabStatus — the Lab has its own status language (placeholder / draft /
 * published), distinct from the work archive's Tag, so the marker lives
 * here. Placeholders wear the dashed "Experiment" treatment — tentative,
 * lab register.
 */
function LabStatus({ status }: { status: LabEntry["status"] }) {
  if (status === "placeholder") {
    return (
      <span className="inline-flex items-center border border-dashed border-gray-400 px-2.5 py-1 font-mono text-meta uppercase tracking-wide text-gray-600">
        Placeholder
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center border border-ink px-2.5 py-1 font-mono text-meta uppercase tracking-wide text-ink">
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center border border-accent bg-accent px-2.5 py-1 font-mono text-meta uppercase tracking-wide text-paper">
      Published
    </span>
  );
}

export default function LabPage() {
  return (
    <main>
      {/* Identity: the Lab gets its own title treatment, set like a
          specimen label rather than a marketing headline. */}
      <Section className="border-b border-gray-200 pb-16 md:pb-24">
        <Container>
          <Reveal>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              Argonath Group — Research index
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-display-1 text-ink">
              LAB<span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-10 max-w-2xl text-body-lg text-gray-700 md:ml-[12.5%]">
              {labIdentityLine}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Index of experiments — editorial rows, not product cards. */}
      <Section>
        <Container>
          <Reveal>
            <h2 className="sr-only">Experiments</h2>
          </Reveal>
          <ol className="border-b border-gray-200">
            {labEntries.map((entry, i) => (
              <li key={entry.slug} className="border-t border-gray-200">
                <Reveal delay={i * 60}>
                  <Link
                    href={`/lab/${entry.slug}`}
                    className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-4 py-8 md:grid-cols-[4rem_1fr_auto] md:gap-x-10 md:py-10"
                  >
                    <span className="font-mono text-meta uppercase tracking-wide text-gray-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-display-3 text-ink transition-colors duration-200 group-hover:text-accent">
                        {entry.title}
                      </span>
                      <span className="mt-3 block max-w-xl text-body text-gray-600">
                        {entry.summary}
                      </span>
                    </span>
                    <span className="col-start-2 flex items-center gap-4 md:col-start-3 md:flex-col md:items-end md:gap-3">
                      <LabStatus status={entry.status} />
                      <time
                        dateTime={entry.date}
                        className="font-mono text-meta uppercase tracking-wide text-gray-500"
                      >
                        {formatDate(entry.date)}
                      </time>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </main>
  );
}
