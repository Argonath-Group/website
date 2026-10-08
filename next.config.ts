import type { NextConfig } from "next";

/**
 * next.config.ts — permanent redirects for the Argonath-first IA
 * restructure (D-023/D-024). The entire /work tree was replaced by
 * /projects; old URLs redirect rather than 404 so existing links keep
 * working. Redirects live here (one config table, zero page code), not
 * as redirect pages.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/akita", destination: "/projects/akita", permanent: true },
      { source: "/work/labeler", destination: "/projects", permanent: true },
      {
        source: "/work/signal-field",
        destination: "/projects/signal-field",
        permanent: true,
      },
      {
        source: "/work/parallax-loom",
        destination: "/projects/parallax-loom",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
