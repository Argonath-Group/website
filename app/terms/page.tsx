import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { legalCopy, CONTACT_EMAIL } from "@/content/site";

const page = legalCopy.terms;

export const metadata: Metadata = {
  title: page.heading,
  description: page.status,
};

/**
 * /terms — designed shell (D-023). Same contract as /privacy: the route
 * exists, the copy is honest, no invented legal text (D-014). Footer
 * links go live only when real copy replaces the stub.
 */
export default function TermsPage() {
  return (
    <main>
      <Section className="pb-16 md:pb-24">
        <Container>
          <Reveal>
            <h1 className="font-display text-display-1">{page.heading}</h1>
          </Reveal>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <Reveal>
            <div className="max-w-2xl border border-dashed border-gray-300 bg-gray-100 p-8 md:p-10">
              <p className="font-mono text-meta uppercase tracking-wide text-gray-500">
                {page.status}
              </p>
              <p className="mt-4 text-body-lg leading-[1.55] text-gray-600">
                {page.body}
              </p>
              <p className="mt-6 font-mono text-meta uppercase tracking-wide">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-accent underline decoration-accent underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
