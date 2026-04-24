import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { ErrorCode } from '@/api/error-codes';
import { authApi } from '@/api/auth';
import { Button } from '@/components/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing, typography } from '@/theme';

const MIN_PASSWORD = 8;

export default function ResetPasswordScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  // `token` comes from the email deep link (shoppa://reset-password?token=…).
  // `identifier` is an optional pass-through from forgot-password for the
  // subtitle copy — never required.
  const { identifier, token: tokenParam } = useLocalSearchParams<{
    identifier?: string;
    token?: string;
  }>();
  const [token, setToken] = useState(tokenParam ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const arrivedFromEmailLink = !!tokenParam;

  const mutation = useMutation({
    mutationFn: () => authApi.resetPassword(token.trim(), newPassword),
    onSuccess: () => {
      Alert.alert('Password reset', 'Your password has been reset. Sign in with your new password.');
      router.replace('/(auth)/login');
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError && err.code === ErrorCode.AUTH_UNAUTHORIZED
          ? 'Reset token is invalid or expired.'
          : err instanceof Error
            ? err.message
            : 'Could not reset password. Try again.';
      Alert.alert('Reset failed', msg);
    },
  });

  const canSubmit = token.trim().length > 0 && newPassword.length >= MIN_PASSWORD && !mutation.isPending;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.content}>
          <ScreenHeader />

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {arrivedFromEmailLink
              ? 'Choose a new password to finish resetting your account.'
              : `Enter the token we sent${identifier ? ` to ${identifier}` : ''} and choose a new password.`}
          </Text>

          {arrivedFromEmailLink ? null : (
            <View style={styles.field}>
              <Input
                label="Reset token"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="paste token"
                autoFocus
              />
            </View>
          )}

          <View style={styles.field}>
            <Input
              label="New password"
              autoFocus={arrivedFromEmailLink}
              hint={`${MIN_PASSWORD}+ characters`}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              placeholder="••••••••"
              trailing={
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  {showPassword ? (
                    <EyeIcon size={20} color={colors.text.tertiary} />
                  ) : (
                    <EyeOffIcon size={20} color={colors.text.tertiary} />
                  )}
                </Pressable>
              }
            />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            label="Reset password"
            disabled={!canSubmit}
            loading={mutation.isPending}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mutation.mutate();
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
  footer: { paddingHorizontal: spacing.screenPadding },
});
