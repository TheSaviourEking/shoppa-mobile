import { parseAmount, transactionDirection, type Transaction, type TransactionType } from './wallet';

const makeTx = (over: Partial<Transaction> = {}): Transaction => ({
  id: 'tx-1',
  walletId: 'w-1',
  type: 'TOPUP',
  amount: '1000.00',
  description: '',
  postId: null,
  counterpartyUserId: null,
  status: 'SUCCESS',
  createdAt: '2026-04-01T00:00:00Z',
  ...over,
});

describe('transactionDirection', () => {
  it.each<[TransactionType, 'in' | 'out']>([
    ['TOPUP', 'in'],
    ['CREDIT', 'in'],
    ['REFUND', 'in'],
    ['DEBIT', 'out'],
  ])('%s maps to %s', (type, expected) => {
    expect(transactionDirection(makeTx({ type }))).toBe(expected);
  });
});

describe('parseAmount', () => {
  it('coerces the Decimal-as-string back to a number', () => {
    expect(parseAmount('1000.00')).toBe(1000);
    expect(parseAmount('50000')).toBe(50000);
    expect(parseAmount('0.5')).toBe(0.5);
  });

  it('returns 0 for non-numeric input rather than NaN', () => {
    expect(parseAmount('not-a-number')).toBe(0);
    expect(parseAmount('')).toBe(0);
  });
});
