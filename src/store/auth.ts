import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { AuthTokens } from '@/api/types';

const ACCESS_KEY = 'shoppa.accessToken';
const REFRESH_KEY = 'shoppa.refreshToken';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  async hydrate() {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    set({ accessToken, refreshToken, hydrated: true });
  },

  async setTokens({ accessToken, refreshToken }) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
    ]);
    set({ accessToken, refreshToken });
  },

  async signOut() {
    await Promise.all([SecureStore.deleteItemAsync(ACCESS_KEY), SecureStore.deleteItemAsync(REFRESH_KEY)]);
    set({ accessToken: null, refreshToken: null });
  },
}));
