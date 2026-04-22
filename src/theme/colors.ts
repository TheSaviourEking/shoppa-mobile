export const colors = {
  brand: {
    primary: '#905FF8',
    primaryTint: '#F7F3FF',
    onPurpleMuted: '#D5C2FC',
  },
  surface: {
    base: '#FFFFFF',
    muted: '#F5F5F5',
    softer: '#F9F9F9',
    overlay: 'rgba(255,255,255,0.25)',
    modalBackdrop: 'rgba(11,1,32,0.28)',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#555555',
    tertiary: '#808080',
    hint: '#A3A3A3',
    onBrand: '#FFFFFF',
    deep: '#0B0120',
    indigo: '#131531',
  },
  border: {
    base: '#E8E8E8',
    strong: '#D1D1D1',
    soft: '#D7D7D7',
  },
  status: {
    success: '#00CC2C',
    error: '#E63047',
    link: '#007AFF',
  },
  homeIndicator: {
    active: '#000000',
    inactive: '#D7D7D7',
  },
  avatarFallback: '#D4B2AF',
} as const;

export type AppColors = typeof colors;
