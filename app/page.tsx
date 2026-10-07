import Link from "next/link";
import {
  aboutCopy,
  CONTACT_EMAIL,
  homeCopy,
  workEntries,
  type HomeLiveWorkItem,
  type WorkEntry,
} from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "@/components/home/HeroVisual";

/**
 * app/page.tsx — homepage (brief §4.1).
 *
 * An R&D studio front door, not a product landing page: one interactive
 * hero gesture, then editorial sections in descending order of weight —
 * research focus, the live pair (equal footing), the full work archive,
 * lab and about teasers, a direct contact line.
 */

/* Enrich the live-work pair with archive metadata (year, kind, status). */
const liveWork = homeCopy.liveWork.items
  .map((item) => ({
    item,
    entry: workEntries.find((e) => e.slug === item.slug),
  }))
  .filter(
    (x): x is { item: HomeLiveWorkItem; entry: WorkEntry } =>
      x.entry !== undefined
  );

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
      {/* Live work — Akita and Labeler as an equal editorial pair   */}
      {/* ---------------------------------------------------------- */}
      <Section aria-labelledby="live-work-heading">
        <Container>
          <Reveal>
            <h2 id="live-work-heading" className="font-display text-display-3">
              {homeCopy.liveWork.heading}
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-14 md:mt-20 md:grid-cols-2 md:gap-0 md:divide-x md:divide-gray-200">
            {liveWork.map(({ item, entry }, i) => (
              <Reveal
                key={item.slug}
                delay={i * 120}
                className={i === 0 ? "md:pr-14" : "md:pl-14"}
              >
                <Tag status={entry.status} kind={entry.kind} />
                <h3 className="mt-6 font-display text-display-3">
                  <Link
                    href={`/work/${item.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {item.name}
                  </Link>
                </h3>
                <p className="mt-4 max-w-md text-body-lg text-gray-600">
                  {item.oneLiner}
                </p>
                <p className="mt-8 font-mono text-meta uppercase tracking-wide">
                  <Link
                    href={`/work/${item.slug}`}
                    className="text-gray-600 underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    View case →
                  </Link>
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/* Selected work — the archive: live pair + seeded futures     */}
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
            {workEntries.map((entry, i) => (
              <Reveal key={entry.slug} delay={i * 60}>
                <Link
                  href={entry.href}
                  className="group grid grid-cols-1 gap-3 border-t border-gray-200 py-8 transition-colors last:border-b md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
                >
                  <span className="font-mono text-meta text-gray-500 md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-title transition-colors group-hover:text-accent md:col-span-3">
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
                </Link>
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
