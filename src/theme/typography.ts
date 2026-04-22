export const fontFamilies = {
  display: 'ClashGrotesk-Semibold',
  body: 'Onest-Regular',
  bodyMedium: 'Onest-Medium',
  bodySemibold: 'Onest-SemiBold',
} as const;

export const typography = {
  h1: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 36 },
  h2: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 30 },
  body: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 22 },
  bodyLarge: { fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamilies.bodyMedium, fontSize: 14, lineHeight: 20 },
  cta: { fontFamily: fontFamilies.bodySemibold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18 },
} as const;

export type AppTypography = typeof typography;
