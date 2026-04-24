import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, spacing, typography } from '@/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const setSignup = useSignupFlow((s) => s.set);

  const { mutate, isPending } = useMutation({
    mutationFn: (input: string) => authApi.requestOtp(input),
    onSuccess: (res, input) => {
      setSignup({ email: input });
      router.push({
        pathname: '/(auth)/otp',
        params: { retryAfter: String(res.retryAfterSeconds) },
      });
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Could not send the code. Check your connection and try again.';
      Alert.alert('Sign up failed', msg);
    },
  });

  const trimmed = email.trim();
  const canContinue = EMAIL_RE.test(trimmed);

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.content}>
          <ScreenHeader step={1} totalSteps={3} />

          <Text style={styles.title}>Sign up to Shoppa</Text>
          <Text style={styles.subtitle}>Get someone to shop for you.</Text>

          <View style={styles.field}>
            <Input
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholder="enter email"
              autoFocus
            />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            label="Continue"
            disabled={!canContinue}
            loading={isPending}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mutate(trimmed.toLowerCase());
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },
  field: { marginTop: spacing.xl },
  footer: { paddingHorizontal: spacing.screenPadding },
});
