import { notFound } from "next/navigation";
import { workEntries } from "@/content/site";

// Static pages exist for these; the dynamic segment covers the rest.
const staticSlugs = new Set(["akita", "labeler"]);

export function generateStaticParams() {
  return workEntries
    .filter((entry) => !staticSlugs.has(entry.slug))
    .map((entry) => ({ slug: entry.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = workEntries.find((e) => e.slug === slug);
  if (!entry || staticSlugs.has(slug)) notFound();

  return (
    <main>
      <div>Route: /work/{slug} — {entry.name}</div>
    </main>
  );
}
