import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { labEntries } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Prose } from "@/components/ui/Prose";

export function generateStaticParams() {
  return labEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = labEntries.find((e) => e.slug === slug);
  if (!entry) return { title: "Lab" };
  return { title: `${entry.title} — Lab`, description: entry.summary };
}

/** ISO date rendered instrument-style, stable across timezones. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = labEntries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const isPlaceholder = entry.status === "placeholder";

  return (
    <main>
      <Section className="pb-16 md:pb-24">
        <Container>
          {/* Breadcrumb back to the index. */}
          <Reveal>
            <nav aria-label="Breadcrumb">
              <Link
                href="/lab"
                className="font-mono text-meta uppercase tracking-wide text-gray-500 underline decoration-gray-300 underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
              >
                &larr; Lab
              </Link>
            </nav>
          </Reveal>

          <Reveal delay={80}>
            <header className="mt-12 max-w-3xl">
              <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-meta uppercase tracking-wide text-gray-500">
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                {isPlaceholder && (
                  <span className="inline-flex items-center border border-dashed border-gray-400 px-2.5 py-1 text-gray-600">
                    Placeholder
                  </span>
                )}
              </p>
              <h1 className="mt-6 font-display text-display-2 text-ink">
                {entry.title}
              </h1>
            </header>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12">
              <Prose>
                <p>{entry.summary}</p>
              </Prose>
            </div>
          </Reveal>

          {/* Placeholder entries are honest about being undocumented. */}
          {isPlaceholder && (
            <Reveal delay={220}>
              <div className="mt-12 max-w-2xl border border-dashed border-gray-300 bg-gray-100 p-8">
                <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
                  Documentation pending
                </p>
                <p className="mt-3 text-body text-gray-600">
                  This experiment is still being documented. The notes, images,
                  and results will live here once they are written up.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </Section>
    </main>
  );
}
