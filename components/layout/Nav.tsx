"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems, siteMeta, type Locale } from "@/content/site";
import { LocaleToggle } from "./LocaleToggle";

/**
 * Nav — site header: wordmark + WORK · LAB · ABOUT · CONTACT.
 *
 * Desktop: inline mono links with aria-current on the active route,
 * plus the EN/ES locale toggle (D-021). Mobile (≤md): a disclosure
 * button (aria-expanded/aria-controls) opens a full-screen paper panel.
 * Keyboard contract:
 *  - Escape closes the menu and returns focus to the trigger
 *  - focus moves into the panel on open, is contained (Tab cycles), and
 *    returns to the trigger on close
 *  - route change closes the menu
 *  - body scroll is locked while the menu is open
 */
export function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Close on route change (adjust-during-render, not an effect). */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Lock body scroll while open. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Focus containment + Escape. */
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const firstLink = panel?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>("a, button")
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-paper/90 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-site items-center justify-between px-6 md:h-20 md:px-10"
      >
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight"
          aria-label={`${siteMeta.name} — home`}
        >
          Argonath<span className="text-accent">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-mono text-meta uppercase tracking-wide transition-colors ${
                      active ? "text-accent" : "text-gray-600 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <LocaleToggle locale={locale} />
        </div>

        {/* Mobile trigger */}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 min-w-11 items-center justify-center font-mono text-meta uppercase tracking-wide md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile panel — full-screen overlay at 375px and up layouts */}
      {open && (
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 top-16 z-40 flex flex-col bg-paper md:hidden"
        >
          <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
            {navItems.map((item, i) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 items-center border-b border-gray-200 font-display text-display-3 ${
                      active ? "text-accent" : "text-ink"
                    }`}
                  >
                    <span className="mr-4 font-mono text-meta text-gray-500">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Locale toggle inside the panel so it is covered by the
              focus trap and Escape/close behavior. */}
          <div className="px-6 pb-10">
            <LocaleToggle locale={locale} />
          </div>
        </div>
      )}
    </header>
  );
}
