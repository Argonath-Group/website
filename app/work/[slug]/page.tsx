import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { workEntries } from "@/content/site";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/ui/Reveal";

// Static pages exist for these; the dynamic segment covers the rest.
const staticSlugs = new Set(["akita", "labeler"]);

export function generateStaticParams() {
  return workEntries
    .filter((entry) => !staticSlugs.has(entry.slug))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = workEntries.find((e) => e.slug === slug);
  if (!entry) return { title: "Work" };
  return { title: entry.name, description: entry.oneLiner };
}

/**
 * /work/[slug] — detail pages for research/experiment archive entries
 * (signal-field, parallax-loom; the live pair has dedicated static
 * pages). These entries are seeded and not yet fully documented, so the
 * page renders through the shared CaseStudy template (D-006) with the
 * entry's real archive data and an honest, designed placeholder block —
 * never a raw dev marker or an invented case study.
 */
export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = workEntries.find((e) => e.slug === slug);
  if (!entry || staticSlugs.has(slug)) notFound();

  return (
    <CaseStudy
      entry={entry}
      sections={[
        {
          id: "overview",
          title: "Overview",
          children: (
            <Prose>
              <p>{entry.oneLiner}</p>
            </Prose>
          ),
        },
      ]}
      footer={
        // Honest placeholder, styled like the Lab's: a dashed frame
        // that says the case study is not written yet.
        <Reveal>
          <div className="max-w-2xl border border-dashed border-gray-300 bg-gray-100 p-8">
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              Case study in progress
            </p>
            <p className="mt-3 text-body text-gray-600">
              This entry is part of the open archive. The full write-up —
              process, images, and results — will live here once it is
              documented.
            </p>
          </div>
        </Reveal>
      }
    />
  );
}
