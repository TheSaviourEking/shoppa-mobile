/**
 * Insert thousands separators into a string of digits: "5000000" → "5,000,000".
 * Works on the string directly so very large values past Number.MAX_SAFE_INTEGER
 * don't lose precision through a Number() round-trip (budgets are stored as
 * Decimal(14,2) on the backend and could plausibly exceed 2^53).
 *
 * Returns an empty string for empty input so TextInput bindings stay clean.
 */
export function formatThousands(digits: string): string {
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
