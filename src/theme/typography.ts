/**
 * Font family keys. Values must match the names registered in expo-font.
 * Onest comes from @expo-google-fonts/onest. The Figma design uses
 * Clash Grotesk for display; until the .ttf is bundled, `display` falls
 * back to Onest 700 Bold (see assets/fonts/README.md for the swap).
 */
export const fontFamilies = {
  display: 'Onest_700Bold',
  body: 'Onest_400Regular',
  bodyMedium: 'Onest_500Medium',
  bodySemibold: 'Onest_600SemiBold',
  bodyBold: 'Onest_700Bold',
} as const;

export const typography = {
  // Display — Clash Grotesk
  h1: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 36 },
  h2: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 30 },

  // Onboarding hero headline (Onest 700 28/34)
  hero: { fontFamily: fontFamilies.bodyBold, fontSize: 22, lineHeight: 32 },

  // Body
  body: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 22 },
  bodyLarge: { fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24 },

  // Labels + CTA
  label: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, lineHeight: 20 },
  cta: { fontFamily: fontFamilies.bodySemibold, fontSize: 16, lineHeight: 24 },

  // Small + footnote
  caption: { fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 },
  captionSemibold: { fontFamily: fontFamilies.bodySemibold, fontSize: 12, lineHeight: 18 },

  // Onboarding "Welcome to Shoppa" eyebrow
  eyebrow: { fontFamily: fontFamilies.bodySemibold, fontSize: 12, lineHeight: 18 },
} as const;

export type AppTypography = typeof typography;
