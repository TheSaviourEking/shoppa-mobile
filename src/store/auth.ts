import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { AuthTokens } from '@/api/types';
import { queryClient } from '@/lib/queryClient';

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

/**
 * Best-effort server-side revocation. Imported dynamically to sidestep the
 * circular chain (store → authApi → api client → store) — none of the
 * transitive modules are loaded until signOut actually runs. Silent on
 * failure: a missing network or an already-revoked token must never leave
 * the user stuck signed-in locally.
 */
async function revokeServerSide(refreshToken: string): Promise<void> {
  try {
    const { authApi } = await import('@/api/auth');
    await authApi.logout(refreshToken);
  } catch {
    // swallow — local sign-out still proceeds.
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
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
    const { refreshToken } = get();
    if (refreshToken) {
      await revokeServerSide(refreshToken);
    }
    await Promise.all([SecureStore.deleteItemAsync(ACCESS_KEY), SecureStore.deleteItemAsync(REFRESH_KEY)]);
    // Drop every cached query so a subsequent login doesn't inherit the
    // previous user's /me, wallet, posts, etc.
    queryClient.clear();
    set({ accessToken: null, refreshToken: null });
  },
}));
