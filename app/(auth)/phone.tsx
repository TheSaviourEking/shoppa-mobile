import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { Button } from '@/components/Button';
import { Input, InputPrefix } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, spacing, typography } from '@/theme';

const E164_NIGERIA_PREFIX = '+234';

function normalisePhone(local: string): string {
  // Backend accepts already-E.164 strings; for local entries (08…) we trim
  // the leading 0 and prepend +234. The backend re-validates with libphonenumber-js.
  const digits = local.replace(/\D/g, '');
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `${E164_NIGERIA_PREFIX}${digits.slice(1)}`;
  return `${E164_NIGERIA_PREFIX}${digits}`;
}

export default function PhoneScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [local, setLocal] = useState('');
  const setSignup = useSignupFlow((s) => s.set);

  const { mutate, isPending } = useMutation({
    mutationFn: (phone: string) => authApi.requestOtp(phone),
    onSuccess: (res, phone) => {
      setSignup({ phone });
      router.push({
        pathname: '/(auth)/otp',
        params: { devCode: res.devCode ?? '' },
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

  const canContinue = local.replace(/\D/g, '').length >= 9;

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
              label="Phone number"
              keyboardType="phone-pad"
              value={local}
              onChangeText={setLocal}
              placeholder="enter number"
              autoFocus
              leadingPrefix={
                <InputPrefix>
                  <View style={styles.flag} />
                  <Text style={styles.prefixText}>{E164_NIGERIA_PREFIX}</Text>
                </InputPrefix>
              }
            />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            label="Continue"
            disabled={!canContinue}
            loading={isPending}
            onPress={() => mutate(normalisePhone(local))}
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
  flag: {
    width: 18,
    height: 18,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
    marginRight: spacing.sm,
  },
  prefixText: { ...typography.bodyLarge, color: colors.text.primary },
  footer: { paddingHorizontal: spacing.screenPadding },
});
