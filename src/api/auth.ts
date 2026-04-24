import { api } from './client';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  goal: 'BUY' | 'EARN' | null;
  notificationsEnabled: boolean;
  avatarKey: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface OtpRequestResponse {
  expiresInSeconds: number;
  retryAfterSeconds: number;
  devCode?: string;
}

export interface OtpVerifyResponse {
  signupToken: string;
}

export interface SignupBody {
  signupToken: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  goal?: 'BUY' | 'EARN';
}

export const authApi = {
  requestOtp: (email: string): Promise<OtpRequestResponse> =>
    api.post<OtpRequestResponse>('/auth/otp/request', { email }, { unauthenticated: true }),

  verifyOtp: (email: string, code: string): Promise<OtpVerifyResponse> =>
    api.post<OtpVerifyResponse>('/auth/otp/verify', { email, code }, { unauthenticated: true }),

  signup: (body: SignupBody): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/signup', body, { unauthenticated: true }),

  login: (identifier: string, password: string): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/login', { identifier, password }, { unauthenticated: true }),

  forgotPassword: (identifier: string): Promise<void> =>
    api.post<void>('/auth/forgot-password', { identifier }, { unauthenticated: true }),

  resetPassword: (token: string, newPassword: string): Promise<void> =>
    api.post<void>('/auth/reset-password', { token, newPassword }, { unauthenticated: true }),

  logout: (refreshToken: string): Promise<void> =>
    api.post<void>('/auth/logout', { refreshToken }, { unauthenticated: true }),

  oauthGoogle: (idToken: string): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/oauth/google', { idToken }, { unauthenticated: true }),

  oauthApple: (identityToken: string): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/oauth/apple', { identityToken }, { unauthenticated: true }),
};
