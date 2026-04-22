export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  /** Expected national subscriber number length (digits after the dial code, leading 0 stripped). */
  nsnLength: number;
  /** Example local number to show as placeholder hint. */
  example: string;
}

// Curated set covering the common picks for a Nigerian-first marketplace.
// `flag` uses the unicode regional-indicator pair which renders as a real
// flag on both iOS and Android 7+. `nsnLength` is the number of digits the
// backend's libphonenumber-js will expect after the dial code.
export const COUNTRIES: readonly Country[] = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', nsnLength: 10, example: '8012345678' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', nsnLength: 9, example: '241234567' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪', nsnLength: 9, example: '712345678' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', nsnLength: 9, example: '711234567' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬', nsnLength: 10, example: '1001234567' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮', nsnLength: 10, example: '0102030405' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳', nsnLength: 9, example: '701234567' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲', nsnLength: 9, example: '671234567' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼', nsnLength: 9, example: '781234567' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿', nsnLength: 9, example: '712345678' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬', nsnLength: 9, example: '712345678' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', nsnLength: 10, example: '7400123456' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', nsnLength: 10, example: '2025550143' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', nsnLength: 10, example: '4165550143' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', nsnLength: 10, example: '9876543210' },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    nsnLength: 9,
    example: '501234567',
  },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0];

export function findCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? DEFAULT_COUNTRY;
}
