import { api } from './client';

// The backend ships Decimal columns as strings in JSON to avoid float precision
// loss. We coerce to `number` at the edge — NGN amounts sit comfortably inside
// JS safe-integer range for any realistic user balance.

export interface Wallet {
  id: string;
  userId: string;
  balance: string; // Decimal(14,2)
  virtualAccountProvider: string;
  virtualAccountNumber: string;
  createdAt: string;
}

export type TransactionType = 'TOPUP' | 'DEBIT' | 'CREDIT' | 'REFUND';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: string; // Decimal(14,2)
  description: string;
  postId: string | null;
  counterpartyUserId: string | null;
  status: TransactionStatus;
  createdAt: string;
}

export interface ListTransactionsParams {
  limit?: number;
  before?: string;
}

export interface TopUpBody {
  amount: number;
}

export const walletApi = {
  getMine: (): Promise<Wallet> => api.get<Wallet>('/wallet'),

  listTransactions: (params: ListTransactionsParams = {}): Promise<Transaction[]> => {
    const q = new URLSearchParams();
    if (params.limit !== undefined) q.set('limit', String(params.limit));
    if (params.before) q.set('before', params.before);
    const suffix = q.toString();
    return api.get<Transaction[]>(`/wallet/transactions${suffix ? `?${suffix}` : ''}`);
  },

  topUp: (body: TopUpBody): Promise<Transaction> => api.post<Transaction>('/wallet/topup', body),

  payForPost: (postId: string): Promise<Transaction> => api.post<Transaction>(`/posts/${postId}/pay`),
};

// Direction is a UI-only concern: credits (money in) vs debits (money out).
export function transactionDirection(tx: Transaction): 'in' | 'out' {
  return tx.type === 'TOPUP' || tx.type === 'CREDIT' || tx.type === 'REFUND' ? 'in' : 'out';
}

export function parseAmount(amount: string): number {
  const n = Number(amount);
  return Number.isFinite(n) ? n : 0;
}
