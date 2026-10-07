import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteMeta } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/**
 * Type pairing (D-008):
 *  - Space Grotesk  → display (grotesque with character, tight tracking)
 *  - IBM Plex Sans  → body text (neutral, research-lab register)
 *  - IBM Plex Mono  → labels, tags, metadata (instrument readout feel)
 * All self-hosted via next/font/google; no layout shift (display: swap).
 */

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // D-011: env-optional, domain assumed
  title: {
    default: siteMeta.name,
    template: `%s — ${siteMeta.name}`,
  },
  description: siteMeta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} flex min-h-screen flex-col`}
      >
        {/* Skip link: first focusable element, jumps past the nav. */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-meta focus:uppercase focus:text-paper"
        >
          Skip to content
        </a>

        <Nav />

        {/* Pages own their <main> landmark; the shell provides the
            skip target and the flex column that pins the footer low. */}
        <div id="content" className="flex-1">
          {children}
        </div>

        <Footer />

        {/* D-017: Vercel Analytics — zero-config page views, free tier. */}
        <Analytics />
      </body>
    </html>
  );
}
