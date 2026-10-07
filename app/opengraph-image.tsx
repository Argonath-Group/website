import { ImageResponse } from "next/og";
import { siteMeta } from "@/content/site";

/**
 * app/opengraph-image.tsx — the site's social card (D-009, built by QA).
 *
 * Typography-led 1200×630 composition from the design tokens only:
 * paper field, ink display wordmark, the signal-blue bar from the icon
 * glyph, mono metadata lines. Rendered by next/og at build time —
 * static, no runtime cost, no new dependencies, no sharp.
 */

export const size = { width: 1200, height: 630 };
export const alt = `${siteMeta.name} — independent R&D studio`;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fbfbf8",
          color: "#141412",
          padding: 72,
        }}
      >
        {/* Top row: studio wordmark + index marker, instrument register. */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", alignItems: "baseline" }}>
            Argonath<span style={{ color: "#1a3aff" }}>.</span>
          </span>
          <span style={{ color: "#6a6a64" }}>R&D — Visual technology</span>
        </div>

        {/* Center: the statement. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            New ways to see, create, and interact.
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#555550",
              maxWidth: 860,
            }}
          >
            {siteMeta.description}
          </div>
        </div>

        {/* Bottom: the one accent gesture — the icon's blue bar. */}
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: 240, height: 14, backgroundColor: "#1a3aff" }} />
          <div
            style={{
              marginLeft: "auto",
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6a6a64",
            }}
          >
            argonathgroup.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
