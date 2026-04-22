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
  devCode?: string;
}

export interface OtpVerifyResponse {
  signupToken: string;
}

export interface SignupBody {
  signupToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  goal?: 'BUY' | 'EARN';
}

export const authApi = {
  requestOtp: (phone: string): Promise<OtpRequestResponse> =>
    api.post<OtpRequestResponse>('/auth/otp/request', { phone }, { unauthenticated: true }),

  verifyOtp: (phone: string, code: string): Promise<OtpVerifyResponse> =>
    api.post<OtpVerifyResponse>('/auth/otp/verify', { phone, code }, { unauthenticated: true }),

  signup: (body: SignupBody): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/signup', body, { unauthenticated: true }),

  oauthGoogle: (idToken: string): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/oauth/google', { idToken }, { unauthenticated: true }),

  oauthApple: (identityToken: string): Promise<AuthResult> =>
    api.post<AuthResult>('/auth/oauth/apple', { identityToken }, { unauthenticated: true }),
};
