import type { Metadata } from "next";
import { CONTACT_EMAIL, contactCopy } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Prose } from "@/components/ui/Prose";

export const metadata: Metadata = {
  title: "Contact",
  description: contactCopy.body,
};

/** Location/timezone ship as "TODO(content)" stubs until confirmed. */
function MetaRow({ label, value }: { label: string; value: string }) {
  const missing = value.trim().startsWith("TODO");
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-gray-200 py-5">
      <dt className="w-32 shrink-0 font-mono text-meta uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      {missing ? (
        <dd className="font-mono text-meta uppercase tracking-wide text-gray-400">
          TODO(content)
        </dd>
      ) : (
        <dd className="text-body text-ink">{value}</dd>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <main>
      <Section>
        <Container>
          <Reveal>
            <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
              Contact
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-10 max-w-3xl font-display text-display-2 text-ink">
              {contactCopy.heading}
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8 max-w-xl">
              <Prose className="text-body-lg">
                <p>{contactCopy.body}</p>
              </Prose>
            </div>
          </Reveal>

          {/* Stage-1 spec: email only, no form. The mailto IS the page. */}
          <Reveal delay={240}>
            <div className="mt-16 border-y border-gray-200 py-10 md:py-14">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-block break-all font-display text-display-3 text-accent underline decoration-gray-300 underline-offset-8 transition-colors duration-200 hover:decoration-accent"
              >
                {CONTACT_EMAIL}
                <span
                  aria-hidden="true"
                  className="ml-3 inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-4 border-b border-gray-200">
              <MetaRow label="Location" value={contactCopy.location} />
              <MetaRow label="Timezone" value={contactCopy.timezone} />
            </dl>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
