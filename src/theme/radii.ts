export const radii = {
  none: 0,
  xs: 2.5,
  sm: 8,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 28,
  full: 999,
} as const;

export type AppRadii = typeof radii;
