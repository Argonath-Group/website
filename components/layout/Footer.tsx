import Link from "next/link";
import { CONTACT_EMAIL, navItems, siteMeta } from "@/content/site";
import { Container } from "@/components/ui/Container";

/**
 * Footer — minimal closer: wordmark, primary nav, contact email,
 * copyright. No newsletter, no social grid — the studio register is
 * restraint.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight"
          >
            Argonath<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 max-w-sm text-body text-gray-600">
            {siteMeta.description}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-meta uppercase tracking-wide text-gray-600 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2 md:items-end">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-mono text-meta uppercase tracking-wide text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="font-mono text-meta text-gray-500">
            © {year} {siteMeta.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
