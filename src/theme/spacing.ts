export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screenPadding: 36,
} as const;

export type AppSpacing = typeof spacing;
