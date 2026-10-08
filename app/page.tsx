import Link from "next/link";
import {
  aboutCopy,
  akitaCopy,
  CONTACT_EMAIL,
  homeCopy,
  projectEntries,
  type WorkEntry,
} from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "@/components/home/HeroVisual";

/**
 * app/page.tsx — homepage (brief §4.1, reframed Argonath-first in D-023).
 *
 * An R&D studio front door, not a product landing page: one interactive
 * hero gesture, then editorial sections in descending order of weight —
 * research focus, the featured-projects block (Akita leading as the
 * flagship coming-soon project, Labeler deliberately smaller and
 * linkless), the projects archive, lab and about teasers, a direct
 * contact line.
 */

/* The featured pair, looked up once from the single-sourced archive. */
function requireProjectEntry(slug: string): WorkEntry {
  const entry = projectEntries.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`content/dictionaries is missing the ${slug} entry`);
  }
  return entry;
}
const akita = requireProjectEntry("akita");
const labeler = requireProjectEntry("labeler");

/* Archive rows may be unlinked (Labeler has no page — D-023). */
function ArchiveRow({
  entry,
  index,
  isLast,
}: {
  entry: WorkEntry;
  index: number;
  isLast: boolean;
}) {
  const inner = (
    <>
      <span className="font-mono text-meta text-gray-500 md:col-span-1">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`font-display text-title md:col-span-3 ${
          entry.href
            ? "transition-colors group-hover:text-accent"
            : ""
        }`}
      >
        {entry.name}
      </span>
      <span className="max-w-xl text-body text-gray-600 md:col-span-5">
        {entry.oneLiner}
      </span>
      <span className="flex items-center gap-4 md:col-span-3 md:justify-end">
        <Tag status={entry.status} kind={entry.kind} />
        <span className="font-mono text-meta text-gray-500">
          {entry.year}
        </span>
      </span>
    </>
  );
  const rowClass = `group grid grid-cols-1 gap-3 border-t border-gray-200 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10 ${
    isLast ? "border-b" : ""
  }`;
  return entry.href ? (
    <Link href={entry.href} className={rowClass}>
      {inner}
    </Link>
  ) : (
    <div className={rowClass}>{inner}</div>
  );
}

/* Asymmetric offsets for the three research-focus blocks. */
const FOCUS_LAYOUT = [
  "md:col-span-4 md:col-start-1",
  "md:col-span-4 md:col-start-6 md:mt-24",
  "md:col-span-4 md:col-start-3 md:mt-12",
];

export default function HomePage() {
  return (
    <main>
      {/* ---------------------------------------------------------- */}
      {/* Hero — headline/sub are real HTML (LCP); the glyph field   */}
      {/* behind them is decorative, lazy-mounted, reduced-motion   */}
      {/* safe (see components/home/HeroVisual.tsx).                */}
      {/* ---------------------------------------------------------- */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden"
      >
        <HeroVisual />
        <Container className="relative z-10 flex min-h-[88svh] flex-col justify-center py-32 md:py-40">
          <Reveal>
            <h1
              id="hero-heading"
              className="max-w-5xl font-display text-display-1"
            >
              {homeCopy.hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-xl text-body-lg text-gray-600">
              {homeCopy.hero.sub}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* R&D focus — three research lines, editorial diagonal      */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="focus-heading">
        <Container>
          <Reveal>
            <h2 id="focus-heading" className="font-display text-display-3">
              {homeCopy.focus.heading}
            </h2>
          </Reveal>
          <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-12 md:gap-x-10 md:gap-y-0">
            {homeCopy.focus.blocks.map((block, i) => (
              <Reveal
                key={block.title}
                delay={i * 100}
                className={FOCUS_LAYOUT[i]}
              >
                <p className="font-mono text-meta text-gray-500">
                  0{i + 1}
                </p>
                <h3 className="mt-4 font-display text-title">{block.title}</h3>
                <p className="mt-4 max-w-sm text-body text-gray-600">
                  {block.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Featured projects — Akita leads (coming soon, waitlist CTA); */}
      {/* Labeler deliberately smaller: in development, no link, no    */}
      {/* form (D-023).                                                */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="featured-projects-heading">
        <Container>
          <Reveal>
            <h2
              id="featured-projects-heading"
              className="font-display text-display-3"
            >
              {homeCopy.featuredProjects.heading}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-12 md:gap-10">
            {/* Akita — the lead. */}
            <Reveal className="md:col-span-7">
              <Tag status={akita.status} kind={akita.kind} />
              <h3 className="mt-6 font-display text-display-2">
                <Link
                  href={akita.href}
                  className="transition-colors hover:text-accent"
                >
                  {akita.name}
                </Link>
              </h3>
              <p className="mt-5 max-w-lg text-body-lg text-gray-600">
                {akita.oneLiner}
              </p>
              <div className="mt-8">
                <LinkButton
                  href={akitaCopy.waitlistCta.href}
                  variant="primary"
                >
                  {akitaCopy.waitlistCta.label}
                </LinkButton>
              </div>
            </Reveal>

            {/* Labeler — quiet, linkless, framed. */}
            <Reveal delay={120} className="md:col-span-4 md:col-start-9">
              <div className="border border-gray-200 p-8">
                <Tag status={labeler.status} kind={labeler.kind} />
                <h3 className="mt-5 font-display text-title">
                  {labeler.name}
                </h3>
                <p className="mt-3 text-body text-gray-600">
                  {labeler.oneLiner}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Selected work — the archive: products + seeded futures      */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="selected-work-heading">
        <Container>
          <Reveal>
            <h2
              id="selected-work-heading"
              className="font-display text-display-3"
            >
              {homeCopy.selectedWorkHeading}
            </h2>
          </Reveal>
          <div className="mt-14 md:mt-20">
            {projectEntries.map((entry, i) => (
              <Reveal key={entry.slug} delay={i * 60}>
                <ArchiveRow entry={entry} index={i} isLast={i === projectEntries.length - 1} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Lab teaser                                                  */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="lab-heading">
        <Container>
          <div className="grid gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-7">
              <h2 id="lab-heading" className="font-display text-display-3">
                {homeCopy.labTeaser.heading}
              </h2>
              <p className="mt-6 max-w-xl text-body-lg text-gray-600">
                {homeCopy.labTeaser.body}
              </p>
            </Reveal>
            <Reveal
              delay={120}
              className="flex items-end md:col-span-4 md:col-start-9"
            >
              <LinkButton href="/lab" variant="secondary">
                {homeCopy.labTeaser.ctaLabel}
              </LinkButton>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* About teaser — studio line + the two founders               */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="about-heading">
        <Container>
          <div className="grid gap-14 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <h2 id="about-heading" className="font-display text-display-3">
                {homeCopy.aboutTeaser.heading}
              </h2>
              <p className="mt-6 max-w-lg text-body-lg text-gray-600">
                {homeCopy.aboutTeaser.body}
              </p>
              <div className="mt-10">
                <LinkButton href="/about" variant="secondary">
                  {homeCopy.aboutTeaser.ctaLabel}
                </LinkButton>
              </div>
            </Reveal>
            <Reveal
              delay={120}
              className="md:col-span-5 md:col-start-8"
            >
              <ul className="divide-y divide-gray-200 border-y border-gray-200">
                {aboutCopy.founders.map((founder) => (
                  <li
                    key={founder.name}
                    className="flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="text-body-lg">{founder.name}</span>
                    <span className="font-mono text-meta uppercase tracking-wide text-gray-500">
                      {founder.role}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Contact — minimal, direct                                   */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="contact-heading">
        <Container>
          <Reveal>
            <h2
              id="contact-heading"
              className="max-w-3xl font-display text-display-2"
            >
              {homeCopy.contactCta.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-xl text-body-lg text-gray-600">
              {homeCopy.contactCta.body}
            </p>
            <div className="mt-10">
              <LinkButton
                href={`mailto:${CONTACT_EMAIL}`}
                variant="primary"
              >
                {homeCopy.contactCta.ctaLabel}
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
