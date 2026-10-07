import { notFound } from "next/navigation";
import { labEntries } from "@/content/site";

export function generateStaticParams() {
  return labEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = labEntries.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <main>
      <div>Route: /lab/{slug} — {entry.title}</div>
    </main>
  );
}
