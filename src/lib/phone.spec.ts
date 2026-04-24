import { COUNTRIES } from './countries';
import { toE164 } from './phone';

const NG = COUNTRIES.find((c) => c.code === 'NG')!;
const GH = COUNTRIES.find((c) => c.code === 'GH')!;

describe('toE164', () => {
  it('strips the leading 0 Nigerian carriers use locally', () => {
    expect(toE164(NG, '08012345678')).toBe('+2348012345678');
  });

  it('accepts numbers without the leading 0', () => {
    expect(toE164(NG, '8012345678')).toBe('+2348012345678');
  });

  it('drops spaces, dashes, and stray punctuation', () => {
    expect(toE164(NG, '  080-1234 5678  ')).toBe('+2348012345678');
  });

  it('ignores a user-typed + so the dial code is the only one attached', () => {
    expect(toE164(NG, '+2348012345678')).toBe('+2348012345678');
  });

  it('applies the country-specific dial code', () => {
    expect(toE164(GH, '241234567')).toBe('+233241234567');
  });

  it('drops multiple leading zeroes ("00…" style)', () => {
    expect(toE164(NG, '008012345678')).toBe('+2348012345678');
  });

  it('returns just the dial code for an empty local input', () => {
    expect(toE164(NG, '')).toBe('+234');
  });
});
