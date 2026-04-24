import { api } from './client';

export interface Category {
  id: string;
  name: string;
  iconKey: string;
  sortOrder: number;
}

export interface CreatePostItem {
  name: string;
  imageKey?: string;
}

export interface CreatePostBody {
  categoryId: string;
  deliveryAddressId: string;
  items: CreatePostItem[];
  note?: string;
  budget: number;
  installmentsCount?: 1 | 2 | 3;
}

export interface CreatedPost {
  id: string;
  userId: string;
  categoryId: string;
  deliveryAddressId: string;
  budget: string;
  note: string | null;
  installmentsCount: number;
  status: string;
  createdAt: string;
}

export const postsApi = {
  listCategories: (): Promise<Category[]> => api.get<Category[]>('/categories', { unauthenticated: true }),
  create: (body: CreatePostBody): Promise<CreatedPost> => api.post<CreatedPost>('/posts', body),
};
