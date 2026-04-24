import { useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { ErrorCode } from '@/api/error-codes';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { OtpInput } from '@/components/OtpInput';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, radii, spacing, typography } from '@/theme';
import { WarningIcon } from '@/components/icons/WarningIcon';

const OTP_LENGTH = 6;
// Fallback when the route didn't carry a retryAfter param (direct navigation
// during dev). Matches the backend's first-send backoff.
const RESEND_FALLBACK_S = 25;

function parseRetryAfter(raw: string | string[] | undefined): number {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : RESEND_FALLBACK_S;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function OtpScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const email = useSignupFlow((s) => s.email);
  const setSignup = useSignupFlow((s) => s.set);
  const { retryAfter } = useLocalSearchParams<{ retryAfter?: string }>();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Initial countdown comes from the backend's backoff schedule — first send
  // returns 25s, doubling on each subsequent send. See OtpService.
  const [secondsLeft, setSecondsLeft] = useState<number>(() => parseRetryAfter(retryAfter));
  // Last code we sent to the server. Re-verification only runs when the user
  // actually changes digits — prevents the retry-loop that happens when the
  // verify mutation's object identity changes on every render.
  const lastAttempted = useRef<string>('');

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s: number) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const verify = useMutation({
    mutationFn: () => {
      if (!email) throw new Error('missing email');
      return authApi.verifyOtp(email, code);
    },
    onSuccess: (res) => {
      setSignup({ signupToken: res.signupToken });
      router.replace('/(auth)/profile');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === ErrorCode.AUTH_INVALID_OTP) {
        setError('Incorrect Code');
      } else if (err instanceof ApiError && err.code === ErrorCode.AUTH_OTP_EXPIRED) {
        setError('Incorrect Code');
      } else {
        setError(err instanceof Error ? err.message : 'Could not verify');
      }
    },
  });

  // Auto-submit once 6 digits are entered. Only depend on `code` — `verify`'s
  // object identity churns every render and would otherwise re-fire the
  // mutation after each error, causing an infinite retry loop.
  useEffect(() => {
    if (code.length === OTP_LENGTH && code !== lastAttempted.current) {
      lastAttempted.current = code;
      setError(null);
      verify.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const resend = useMutation({
    mutationFn: () => {
      if (!email) throw new Error('missing email');
      return authApi.requestOtp(email);
    },
    onSuccess: (res) => {
      setError(null);
      setCode('');
      lastAttempted.current = '';
      setSecondsLeft(res.retryAfterSeconds);
    },
    onError: (err) => {
      // Back-to-back resends hit the backend's cooldown; reflect the remaining
      // wait in the countdown so the UI stays truthful.
      if (err instanceof ApiError && err.code === ErrorCode.AUTH_OTP_RATE_LIMITED) {
        const detail = (err.details as { retryAfterSeconds?: number } | undefined)?.retryAfterSeconds;
        if (typeof detail === 'number' && detail > 0) {
          setSecondsLeft(Math.floor(detail));
        }
      }
    },
  });

  const canResend = secondsLeft === 0 && !resend.isPending;

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.sheetWrap}
        // `padding` on both platforms keeps the bottom-sheet above the keyboard.
        // Android's default `adjustResize` doesn't reliably resize a transparent
        // modal route, so we let KAV add explicit bottom padding instead.
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Verify your Email</Text>
              <Text style={styles.subtitle}>Enter the OTP we sent to your email</Text>
            </View>
            <Pressable
              onPress={() => router.back()}
              accessibilityLabel="Close"
              hitSlop={8}
              style={styles.closeBtn}
            >
              <CloseIcon size={16} color={colors.text.secondary} />
            </Pressable>
          </View>

          <View style={styles.otpWrap}>
            <OtpInput value={code} onChange={setCode} hasError={!!error} length={OTP_LENGTH} />
          </View>

          <Text style={styles.resendRow}>
            Didn{"'"}t get the code?{' '}
            {canResend ? (
              <Text style={styles.resendActive} onPress={() => resend.mutate()}>
                Resend
              </Text>
            ) : (
              <Text style={styles.timerActive}>{formatCountdown(secondsLeft)}</Text>
            )}
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* {error ? (
        <View style={[styles.toastWrap, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.toast}>
            <Text style={styles.toastIcon}>!</Text>
            <Text style={styles.toastText}>{error}</Text>
          </View>
        </View>
      ) : null} */}

      {error ? (
        <View style={[styles.toastWrap, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.toast}>
            <WarningIcon size={18} color={colors.surface.base} />
            <Text style={styles.toastText}>{error}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.surface.modalBackdrop },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
  },

  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  title: { ...typography.h5, color: colors.text.secondaryStrong },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  otpWrap: { marginTop: spacing.xl },

  resendRow: {
    ...typography.bodyMedium,
    color: colors.text.hint,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  resendActive: { ...typography.bodyMediumSemibold, color: colors.brand.primary },
  timerActive: { ...typography.bodyMediumSemibold, color: colors.brand.primary },

  toastWrap: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.error,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  toastIcon: {
    width: 18,
    height: 18,
    textAlign: 'center',
    color: colors.status.error,
    backgroundColor: colors.surface.base,
    borderRadius: 9,
    overflow: 'hidden',
    fontWeight: '700',
  },
  toastText: { ...typography.cta, color: colors.text.onBrand },
});
