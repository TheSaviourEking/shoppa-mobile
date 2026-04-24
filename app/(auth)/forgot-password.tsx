import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authApi } from '@/api/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

export default function ForgotPasswordScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [identifier, setIdentifier] = useState('');

  const mutation = useMutation({
    mutationFn: (value: string) => authApi.forgotPassword(value),
    onSuccess: () => {
      router.replace({
        pathname: '/(auth)/reset-password',
        params: { identifier: identifier.trim() },
      });
    },
  });

  // Backend always returns 204 — even for unknown identifiers — so treat any
  // non-network failure as the same "check your inbox" outcome and send the
  // user on. Real failures (no network) will surface via mutation.error.
  const canSubmit = identifier.trim().length > 0 && !mutation.isPending;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.content}>
          <ScreenHeader />

          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email or phone. We{"'"}ll send a reset token you can use on the next screen.
          </Text>

          <View style={styles.field}>
            <Input
              label="Email or phone"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="enter email or phone"
              autoFocus
            />
          </View>

          {mutation.error ? (
            <Text style={styles.error}>
              Could not send the reset token. Check your connection and try again.
            </Text>
          ) : null}
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            label="Send reset token"
            disabled={!canSubmit}
            loading={mutation.isPending}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mutation.mutate(identifier.trim().toLowerCase());
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
  field: { marginTop: spacing.lg },
  error: { ...typography.caption, color: colors.status.error, marginTop: spacing.md },
  footer: { paddingHorizontal: spacing.screenPadding },
});
