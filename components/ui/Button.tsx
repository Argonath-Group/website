import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Button / LinkButton — the only two button styles on the site.
 *
 *   primary   → accent fill, paper text (6.55:1 on #1A3AFF)
 *   secondary → ink outline on paper, transparent
 *
 * Both render at a minimum 44px tap height, mono uppercase label,
 * sharp corners (editorial, not SaaS-round), full keyboard support
 * via the global :focus-visible ring.
 */

type Variant = "primary" | "secondary";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 border px-6 py-3 font-mono text-meta uppercase tracking-wide transition-colors duration-200";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "border-accent bg-accent text-paper hover:bg-accent-ink hover:border-accent-ink",
  secondary:
    "border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
};

export function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANT_STYLES[variant]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/");
  const classes = `${BASE} ${VARIANT_STYLES[variant]} ${className}`.trim();

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
