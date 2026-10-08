import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import type { WorkEntry } from "@/content/site";

/**
 * CaseStudy — THE shared work-detail template (D-006).
 *
 * Contract for the Akita and Labeler page agents (and any future work
 * entry): do NOT fork this component — compose your page as:
 *
 *   <CaseStudy
 *     entry={akita}                    // WorkEntry from content/site.ts
 *     backLabel="← Studio"             // optional, default "← Work"
 *     sections={[
 *       { id: "overview", title: "Overview", children: <Prose>…</Prose> },
 *       // one object per content section — the template owns the rhythm
 *     ]}
 *     footer={<YourCta />}             // optional slot, e.g. ApplyCTA
 *   />
 *
 * The template renders, in order:
 *   1. breadcrumb back to /projects
 *   2. hero header — status Tag, entry name, one-line description
 *   3. numbered content sections (title + your body nodes)
 *   4. optional footer slot (CTAs, cross-links)
 */
export interface CaseStudySection {
  /** Optional anchor id for deep links. */
  id?: string;
  title: string;
  /** Body nodes — typically <Prose>, lists, or custom figures. */
  children: ReactNode;
}

export interface CaseStudyProps {
  entry: WorkEntry;
  /** Breadcrumb label; defaults to "← Projects". */
  backLabel?: string;
  sections: CaseStudySection[];
  /** CTA / cross-link slot rendered after the last section. */
  footer?: ReactNode;
}

export function CaseStudy({
  entry,
  backLabel = "← Projects",
  sections,
  footer,
}: CaseStudyProps) {
  return (
    <article>
      {/* Hero header */}
      <Section className="pb-16 md:pb-24">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-10 md:mb-16">
            <Link
              href="/projects"
              className="font-mono text-meta uppercase tracking-wide text-gray-600 transition-colors hover:text-accent"
            >
              {backLabel}
            </Link>
          </nav>

          <div className="flex flex-col gap-6 md:gap-8">
            <Tag status={entry.status} kind={entry.kind} />
            <h1 className="font-display text-display-2">{entry.name}</h1>
            <p className="max-w-2xl text-body-lg text-gray-600">
              {entry.oneLiner}
            </p>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              {entry.year}
            </p>
          </div>
        </Container>
      </Section>

      {/* Content sections — asymmetric, editorial rhythm */}
      {sections.map((section, i) => (
        <Section key={section.id ?? section.title} id={section.id}>
          <Container>
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="mb-3 font-mono text-meta text-gray-500">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-title">{section.title}</h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                {section.children}
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* Footer slot */}
      {footer ? (
        <Section>
          <Container>{footer}</Container>
        </Section>
      ) : null}
    </article>
  );
}
