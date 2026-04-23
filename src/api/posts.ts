import { api } from './client';

export interface Category {
  id: string;
  name: string;
  iconKey: string;
  sortOrder: number;
}

export const postsApi = {
  listCategories: (): Promise<Category[]> => api.get<Category[]>('/categories', { unauthenticated: true }),
};
