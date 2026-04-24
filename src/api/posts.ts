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

export type PostStatus = 'POSTED' | 'PAID' | 'CANCELLED';

export interface CreatedPost {
  id: string;
  userId: string;
  categoryId: string;
  deliveryAddressId: string;
  budget: string;
  note: string | null;
  installmentsCount: number;
  status: PostStatus;
  createdAt: string;
}

export interface PostItem {
  id: string;
  name: string;
  imageKey: string | null;
  imageUrl: string | null;
}

export interface PostWithRelations extends CreatedPost {
  category: Category;
  items: PostItem[];
  deliveryAddress: {
    id: string;
    line: string;
    city: string;
    state: string;
    country: string;
  };
}

export const postsApi = {
  listCategories: (): Promise<Category[]> => api.get<Category[]>('/categories', { unauthenticated: true }),
  create: (body: CreatePostBody): Promise<CreatedPost> => api.post<CreatedPost>('/posts', body),
  listMine: (): Promise<PostWithRelations[]> => api.get<PostWithRelations[]>('/posts/me'),
  findOne: (id: string): Promise<PostWithRelations> => api.get<PostWithRelations>(`/posts/${id}`),
};
