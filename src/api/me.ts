import { api } from './client';
import type { User } from './auth';

export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarKey?: string;
}

export interface UpdateNotificationsBody {
  enabled: boolean;
}

export const meApi = {
  getMe: (): Promise<User> => api.get<User>('/me'),
  updateProfile: (body: UpdateProfileBody): Promise<User> => api.patch<User>('/me', body),
  updateNotifications: (body: UpdateNotificationsBody): Promise<User> =>
    api.patch<User>('/me/notifications', body),
};
