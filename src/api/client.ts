import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { ErrorCode } from './error-codes';
import type { ApiEnvelope, AuthTokens } from './types';

const DEV_BACKEND_PORT = 3000;

/**
 * Derive the dev backend URL automatically.
 *
 * 1. An explicit `EXPO_PUBLIC_API_BASE_URL` always wins (prod builds, CI).
 * 2. In dev, pull the mac's LAN IP from Expo's `hostUri` — that's how Expo Go
 *    on a physical device connected to Metro, so the same IP reaches the
 *    backend (as long as it listens on 0.0.0.0, which NestJS does by default).
 * 3. If the hostUri is missing or is `localhost` (web / simulator running on
 *    the host), fall back to `localhost` for iOS and `10.0.2.2` for Android.
 */
function resolveBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicit) return explicit;

  // `Constants.expoConfig.hostUri` is the Metro URL, e.g. "192.168.1.10:8081".
  // The older `expoGoConfig.debuggerHost` works on older Expo Go builds.
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { expoGoConfig?: { debuggerHost?: string } }).expoGoConfig?.debuggerHost;
  const host = hostUri?.split(':')[0];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return `http://${host}:${DEV_BACKEND_PORT}`;
  }

  // Simulator / emulator fallbacks when there's no Metro host (e.g. web).
  const simulatorHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${simulatorHost}:${DEV_BACKEND_PORT}`;
}

const BASE_URL = resolveBaseUrl();
const API_PREFIX = '/api/v1';
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  /** When true, skip Authorization + skip refresh-retry (use for /health, /auth/refresh, /auth/login). */
  unauthenticated?: boolean;
}

let refreshInFlight: Promise<AuthTokens> | null = null;

function withTimeout(
  signal: AbortSignal | undefined,
  ms: number,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error('timeout')), ms);
  const onAbort = (): void => controller.abort(signal?.reason);
  signal?.addEventListener('abort', onAbort);
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    },
  };
}

async function rawRequest<T>(path: string, opts: RequestOptions): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${BASE_URL}${path.startsWith('/api') || path === '/health' ? '' : API_PREFIX}${path}`;

  const isFormData = typeof FormData !== 'undefined' && opts.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...opts.headers,
  };

  if (!opts.unauthenticated) {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const { signal, cleanup } = withTimeout(opts.signal, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body:
        opts.body === undefined
          ? undefined
          : isFormData
            ? (opts.body as FormData)
            : JSON.stringify(opts.body),
      signal,
    });
  } finally {
    cleanup();
  }

  // 204 No Content is a successful response with no body by spec —
  // don't try to parse JSON from it. Every backend endpoint that returns
  // 204 maps to a `Promise<void>` on the client side.
  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!json || typeof json.success !== 'boolean') {
    throw new ApiError(ErrorCode.INTERNAL_ERROR, 'Malformed response from server', response.status);
  }

  if (json.success) return json.data;
  throw new ApiError(json.error.code, json.error.message, response.status, json.error.details);
}

async function rotateRefreshToken(refreshToken: string): Promise<AuthTokens> {
  return rawRequest<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    unauthenticated: true,
  });
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, opts);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401 || opts.unauthenticated) throw err;

    const { refreshToken, signOut, setTokens } = useAuthStore.getState();
    if (!refreshToken) {
      await signOut();
      throw err;
    }

    try {
      refreshInFlight ??= rotateRefreshToken(refreshToken).finally(() => {
        refreshInFlight = null;
      });
      const tokens = await refreshInFlight;
      await setTokens(tokens);
    } catch (refreshErr) {
      await signOut();
      throw refreshErr;
    }

    return rawRequest<T>(path, opts);
  }
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    apiRequest<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    apiRequest<T>(path, { ...opts, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    apiRequest<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> =>
    apiRequest<T>(path, { ...opts, method: 'DELETE' }),
};
