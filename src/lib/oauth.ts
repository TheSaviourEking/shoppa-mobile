import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { ApiError } from '@/api/client';
import { type AuthResult, authApi } from '@/api/auth';
import { useAuthStore } from '@/store/auth';

/**
 * OAuth wrappers that call the backend's /auth/oauth/{google,apple} endpoints
 * and persist the returned tokens via the auth store.
 *
 * Configuration: drop client IDs into the Expo env:
 *   EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS
 *   EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
 *   EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB
 * Apple needs no mobile-side ID (identity_token is verified by the backend
 * against the APPLE_OAUTH_AUDIENCE configured there).
 */

const GOOGLE_IOS = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;
const GOOGLE_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;
const GOOGLE_WEB = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
// Google.useAuthRequest throws at render if the platform's client ID is empty.
// Feed it harmless placeholders so the hook can be called unconditionally
// (Rules of Hooks); the signIn() action below gates on the real-config flag.
const GOOGLE_PLACEHOLDER = 'not-configured.apps.googleusercontent.com';
const GOOGLE_CONFIGURED = !!(GOOGLE_IOS ?? GOOGLE_ANDROID ?? GOOGLE_WEB);

interface UseSignInResult {
  /** Whether the button should be enabled (library ready + not in-flight). */
  ready: boolean;
  pending: boolean;
  signIn: () => Promise<void>;
  /** Latest error surfaced by the flow — consumer can show an alert or inline. */
  error: string | null;
  onSuccess?: (result: AuthResult) => void;
}

export function useGoogleSignIn(onSuccess?: (result: AuthResult) => void): UseSignInResult {
  const setTokens = useAuthStore((s) => s.setTokens);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS ?? GOOGLE_PLACEHOLDER,
    androidClientId: GOOGLE_ANDROID ?? GOOGLE_PLACEHOLDER,
    webClientId: GOOGLE_WEB ?? GOOGLE_PLACEHOLDER,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type !== 'success') {
      if (response.type === 'error') {
        setError(response.error?.message ?? 'Google sign-in failed');
      }
      setPending(false);
      return;
    }
    const idToken = response.params.id_token ?? response.authentication?.idToken;
    if (!idToken) {
      setPending(false);
      setError('Google did not return an id token');
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const result = await authApi.oauthGoogle(idToken);
        if (cancelled) return;
        await setTokens({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        onSuccess?.(result);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not complete Google sign-in',
        );
      } finally {
        if (!cancelled) setPending(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [response, setTokens, onSuccess]);

  const signIn = useCallback(async (): Promise<void> => {
    if (!request) return;
    if (!GOOGLE_CONFIGURED) {
      setError('Google sign-in is not configured. Set EXPO_PUBLIC_GOOGLE_CLIENT_ID_* to enable it.');
      return;
    }
    setError(null);
    setPending(true);
    try {
      await promptAsync();
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }, [promptAsync, request]);

  return { ready: !!request, pending, signIn, error };
}

export function useAppleSignIn(onSuccess?: (result: AuthResult) => void): UseSignInResult & {
  available: boolean;
} {
  const setTokens = useAuthStore((s) => s.setTokens);
  const [available, setAvailable] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let cancelled = false;
    AppleAuthentication.isAvailableAsync()
      .then((ok) => {
        if (!cancelled) setAvailable(ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (): Promise<void> => {
    if (!available) {
      setError('Sign in with Apple is not available on this device.');
      return;
    }
    setError(null);
    setPending(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) {
        setError('Apple did not return an identity token');
        return;
      }
      const result = await authApi.oauthApple(credential.identityToken);
      await setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      onSuccess?.(result);
    } catch (err) {
      // ERR_REQUEST_CANCELED is the user tapping Cancel — stay silent.
      const code = (err as { code?: string } | undefined)?.code;
      if (code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED') return;
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not complete Apple sign-in',
      );
    } finally {
      setPending(false);
    }
  }, [available, setTokens, onSuccess]);

  return { ready: available, available, pending, signIn, error };
}
