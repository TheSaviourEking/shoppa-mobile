import { formatThousands } from './number';

describe('formatThousands', () => {
  it('returns empty string for empty input', () => {
    expect(formatThousands('')).toBe('');
  });

  it('leaves 1- and 2-digit values unchanged', () => {
    expect(formatThousands('5')).toBe('5');
    expect(formatThousands('42')).toBe('42');
  });

  it('inserts a single separator at the thousands boundary', () => {
    expect(formatThousands('5000')).toBe('5,000');
    expect(formatThousands('50000')).toBe('50,000');
    expect(formatThousands('500000')).toBe('500,000');
  });

  it('inserts multiple separators for larger values', () => {
    expect(formatThousands('1000000')).toBe('1,000,000');
    expect(formatThousands('50000000')).toBe('50,000,000');
  });

  it('handles the backend Decimal(14,2) digit-cap without losing precision', () => {
    // 12 digits — past Number.MAX_SAFE_INTEGER for contexts that Number()-
    // round-trip, but the string-based formatter doesn't touch numeric types.
    expect(formatThousands('999999999999')).toBe('999,999,999,999');
  });
});
