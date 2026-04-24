import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { ErrorCode } from '@/api/error-codes';
import { Button } from '@/components/Button';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuthStore } from '@/store/auth';
import { colors, spacing, typography } from '@/theme';

const MIN_PASSWORD = 8;

export default function LoginScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.login(identifier.trim(), password),
    onSuccess: async (res) => {
      await setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      router.replace('/(tabs)');
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError && err.code === ErrorCode.AUTH_INVALID_CREDENTIALS
          ? 'Incorrect email/phone or password.'
          : err instanceof ApiError
            ? err.message
            : 'Could not sign you in. Check your connection and try again.';
      Alert.alert('Login failed', msg);
    },
  });

  const canContinue = identifier.trim().length > 0 && password.length >= MIN_PASSWORD && !isPending;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.content}>
          <ScreenHeader />

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to continue.</Text>

          <View style={styles.field}>
            <Input
              label="Email or phone"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="enter email or phone"
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
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
            label="Log in"
            disabled={!canContinue}
            loading={isPending}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mutate();
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
