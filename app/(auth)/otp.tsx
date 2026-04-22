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

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_S = 26;

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function OtpScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { devCode } = useLocalSearchParams<{ devCode?: string }>();
  const phone = useSignupFlow((s) => s.phone);
  const setSignup = useSignupFlow((s) => s.set);

  const [code, setCode] = useState(devCode ?? '');
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_S);
  const verifying = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const verify = useMutation({
    mutationFn: () => {
      if (!phone) throw new Error('missing phone');
      return authApi.verifyOtp(phone, code);
    },
    onSuccess: (res) => {
      setSignup({ signupToken: res.signupToken });
      router.replace('/(auth)/profile');
    },
    onError: (err) => {
      verifying.current = false;
      if (err instanceof ApiError && err.code === ErrorCode.AUTH_INVALID_OTP) {
        setError('Incorrect Code');
      } else if (err instanceof ApiError && err.code === ErrorCode.AUTH_OTP_EXPIRED) {
        setError('Code expired — request a new one');
      } else {
        setError(err instanceof Error ? err.message : 'Could not verify');
      }
    },
  });

  // Auto-submit once 6 digits are entered.
  useEffect(() => {
    if (code.length === OTP_LENGTH && !verifying.current && !verify.isPending) {
      verifying.current = true;
      setError(null);
      verify.mutate();
    }
  }, [code, verify]);

  const resend = useMutation({
    mutationFn: () => {
      if (!phone) throw new Error('missing phone');
      return authApi.requestOtp(phone);
    },
    onSuccess: () => {
      setError(null);
      setCode('');
      setSecondsLeft(RESEND_COOLDOWN_S);
    },
  });

  const canResend = secondsLeft === 0 && !resend.isPending;

  return (
    <View style={styles.root}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <KeyboardAvoidingView style={styles.sheetWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Verify your Phone Number</Text>
              <Text style={styles.subtitle}>Enter the OTP we sent to your phone number</Text>
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

      {error ? (
        <View style={[styles.toastWrap, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.toast}>
            <Text style={styles.toastIcon}>!</Text>
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
  title: { ...typography.h2, color: colors.text.primary },
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

  resendRow: { ...typography.body, color: colors.text.secondary, marginTop: spacing.lg },
  resendActive: { ...typography.bodyLarge, color: colors.brand.primary },
  timerActive: { ...typography.bodyLarge, color: colors.brand.primary },

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
