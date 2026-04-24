import { api } from './client';

export interface Address {
  id: string;
  userId: string;
  label: string | null;
  line: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressBody {
  label?: string;
  line: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}

export const addressesApi = {
  list: (): Promise<Address[]> => api.get<Address[]>('/addresses'),
  create: (body: CreateAddressBody): Promise<Address> => api.post<Address>('/addresses', body),
};

/**
 * Single-line representation for the delivery sheet: "53, Bamidele eletu
 * Avenue Osapa Lagos Nigeria". Drops any empty components so a partial
 * address doesn't render with awkward double-spaces.
 */
export function formatAddressLine(a: Pick<Address, 'line' | 'city' | 'state' | 'country'>): string {
  return [a.line, a.city, a.state, a.country].filter(Boolean).join(' ');
}
