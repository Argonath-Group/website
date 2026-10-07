import type { Metadata } from "next";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { ApplyCTA } from "@/components/ApplyCTA";
import { Prose } from "@/components/ui/Prose";
import { LinkButton } from "@/components/ui/Button";
import { labelerCopy, workEntries, CONTACT_EMAIL } from "@/content/site";

function requireWorkEntry(slug: string) {
  const entry = workEntries.find((e) => e.slug === slug);
  if (!entry) throw new Error(`content/site.ts is missing the ${slug} work entry`);
  return entry;
}

const labeler = requireWorkEntry("labeler");

export const metadata: Metadata = {
  title: labelerCopy.name,
  description: labelerCopy.overview,
};

/**
 * /work/labeler — case study via the shared CaseStudy template (D-006),
 * serving two audiences in sequence (brief §4.4): companies first, then
 * professionals. Each audience gets its own section with an ApplyCTA
 * (D-007) rendered in place — never reimplemented. Both CTAs use the
 * component's default primary variant, so the two audiences are asked
 * to apply with visually equal weight.
 */
export default function LabelerPage() {
  return (
    <CaseStudy
      entry={labeler}
      sections={[
        {
          id: "overview",
          title: "Overview",
          children: (
            <Prose>
              <p>{labelerCopy.overview}</p>
            </Prose>
          ),
        },
        {
          id: "for-companies",
          title: labelerCopy.forCompanies.heading,
          children: (
            <div>
              <Prose>
                <ul>
                  {labelerCopy.forCompanies.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Prose>
              <div className="mt-10">
                <ApplyCTA type="company" />
              </div>
            </div>
          ),
        },
        {
          id: "for-professionals",
          title: labelerCopy.forProfessionals.heading,
          children: (
            <div>
              <Prose>
                <ul>
                  {labelerCopy.forProfessionals.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Prose>
              <div className="mt-10">
                <ApplyCTA type="professional" />
              </div>
            </div>
          ),
        },
        {
          id: "how-it-works",
          title: labelerCopy.howItWorks.heading,
          children: (
            /* The request → matching → annotation → delivery pipeline,
               rendered as a numbered sequence rather than a card stack. */
            <ol className="border-t border-gray-300">
              {labelerCopy.howItWorks.steps.map((step, i) => (
                <li
                  key={step}
                  className="flex items-baseline gap-6 border-b border-gray-300 py-5"
                >
                  <span
                    aria-hidden
                    className="font-mono text-meta text-accent"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          ),
        },
        {
          id: "trust-and-skills",
          title: labelerCopy.trustAndSkills.heading,
          children: (
            <Prose>
              <p>{labelerCopy.trustAndSkills.body}</p>
            </Prose>
          ),
        },
      ]}
      footer={
        <div className="flex flex-col gap-8 border-t border-gray-300 pt-10 md:flex-row md:items-center md:justify-between">
          <LinkButton href="/work" variant="secondary">
            ← All work
          </LinkButton>
          <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
            Inquiries —{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent underline decoration-accent underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      }
    />
  );
}
