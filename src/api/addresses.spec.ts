import { formatAddressLine } from './addresses';

describe('formatAddressLine', () => {
  it('joins all four fields with single spaces', () => {
    expect(
      formatAddressLine({
        line: '53, Bamidele Eletu Avenue',
        city: 'Osapa',
        state: 'Lagos',
        country: 'Nigeria',
      }),
    ).toBe('53, Bamidele Eletu Avenue Osapa Lagos Nigeria');
  });

  it('drops empty components so there are no double spaces', () => {
    expect(formatAddressLine({ line: '53, Bamidele', city: '', state: 'Lagos', country: 'Nigeria' })).toBe(
      '53, Bamidele Lagos Nigeria',
    );
  });

  it('returns an empty string when every field is empty', () => {
    expect(formatAddressLine({ line: '', city: '', state: '', country: '' })).toBe('');
  });
});
