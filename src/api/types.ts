export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiError;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface HealthReport {
  status: 'ok' | 'degraded';
  db: 'ok' | 'unreachable';
  uptimeSeconds: number;
  timestamp: string;
}
