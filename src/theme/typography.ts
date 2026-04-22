// Three-font system per the Figma Inspect specs:
// - Clash Grotesk — display / headings (Heading/H1, H2, H5)
// - Onest — body (Body/Medium/Regular, Body/Medium/SemiBold, Body/Small/Regular)
// - Plus Jakarta Sans — the +234 prefix (Body/Small/SemiBold only, per spec)
//
// Letter-spacing in the figma is expressed as a percentage; RN expects absolute
// pixels. tracking(size, pct) does the conversion. -1.5% is the default for body.

export const fontFamilies = {
  display: 'ClashGrotesk-Semibold',
  body: 'Onest_400Regular',
  bodyMedium: 'Onest_500Medium',
  bodySemibold: 'Onest_600SemiBold',
  bodyBold: 'Onest_700Bold',
  prefixSemibold: 'PlusJakartaSans_600SemiBold',
} as const;

const tracking = (size: number, pct: number): number => Math.round(size * (pct / 100) * 100) / 100;

export const typography = {
  // ── Headings (Clash Grotesk Semibold, 0% tracking per figma) ──────────
  h1: { fontFamily: fontFamilies.display, fontSize: 28, lineHeight: 36 },
  h2: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 32 },
  h5: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 28 },

  // Onboarding hero (same as h2)
  hero: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 36 },

  // ── Body/Medium (Onest, 16px, -1.5% tracking) ─────────────────────────
  bodyMedium: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 25.6, // 160%
    letterSpacing: tracking(16, -1.5),
  },
  bodyMediumSemibold: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    lineHeight: 24.8, // 155%
    letterSpacing: tracking(16, -1.5),
  },

  // ── Body/Large/SemiBold (Onest, 18px, 0% tracking) — OTP cell digit ──
  bodyLargeSemibold: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 18,
    lineHeight: 27.9, // 155%
  },

  // ── Body/Small (14px) ─────────────────────────────────────────────────
  body: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: tracking(14, -1.5),
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 25.6,
    letterSpacing: tracking(16, -1.5),
  },
  bodySemibold: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: tracking(14, -1.5),
  },

  // ── Prefix (Plus Jakarta Sans 14/600/-1.5%) — the +234 country code ──
  prefix: {
    fontFamily: fontFamilies.prefixSemibold,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: tracking(14, -1.5),
  },

  // ── Labels + CTA ──────────────────────────────────────────────────────
  label: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, lineHeight: 20 },
  cta: { fontFamily: fontFamilies.bodySemibold, fontSize: 16, lineHeight: 24 },

  // ── Small / footnote ──────────────────────────────────────────────────
  caption: { fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 },
  captionSemibold: { fontFamily: fontFamilies.bodySemibold, fontSize: 12, lineHeight: 18 },
  eyebrow: { fontFamily: fontFamilies.bodySemibold, fontSize: 12, lineHeight: 18 },
} as const;

export type AppTypography = typeof typography;
