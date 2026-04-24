import type { Country } from './countries';

/**
 * Turn a user-entered local number into an E.164 string the backend can
 * pass through libphonenumber-js without further massaging.
 *
 * - Strips every non-digit the keyboard might let through (spaces, dashes,
 *   the `+`, etc.) so the output is always `{dialCode}{digits}`.
 * - Drops a leading 0 — common local convention in Nigeria / Ghana / Kenya
 *   where 08012345678 really means +2348012345678.
 * - If the user pasted the dial code itself (e.g. typed "+2348012345678"),
 *   strips it before prepending so we don't end up with "+2342348012345678".
 *
 * Returns just the dial code if no local digits were supplied; callers
 * should gate on `local.length` before using the result.
 */
export function toE164(country: Country, local: string): string {
  const dialDigits = country.dialCode.replace(/\D/g, '');
  let digits = local.replace(/\D/g, '');
  if (digits.startsWith(dialDigits)) {
    digits = digits.slice(dialDigits.length);
  }
  digits = digits.replace(/^0+/, '');
  return `${country.dialCode}${digits}`;
}
