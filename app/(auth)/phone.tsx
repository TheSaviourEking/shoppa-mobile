import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { Button } from '@/components/Button';
import { CountryPicker } from '@/components/CountryPicker';
import { Input, InputPrefix } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { type Country, DEFAULT_COUNTRY } from '@/lib/countries';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, spacing, typography } from '@/theme';

function toE164(country: Country, local: string): string {
  // Drop a leading "0" (common local convention in NG/GH/KE) and prepend the
  // dial code. Backend re-validates with libphonenumber-js so anything
  // malformed is caught server-side and surfaced via the error envelope.
  const digits = local.replace(/^0+/, '');
  return `${country.dialCode}${digits}`;
}

export default function PhoneScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [local, setLocal] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [pickerOpen, setPickerOpen] = useState(false);
  const setSignup = useSignupFlow((s) => s.set);

  const { mutate, isPending } = useMutation({
    mutationFn: (phone: string) => authApi.requestOtp(phone),
    onSuccess: (_res, phone) => {
      setSignup({ phone });
      router.push('/(auth)/otp');
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Could not send the code. Check your connection and try again.';
      Alert.alert('Sign up failed', msg);
    },
  });

  const handleChange = useCallback((text: string): void => {
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly !== text) {
      // Reject the non-digit char with a warning haptic — phone numbers are
      // numeric only, and the keyboard's `phone-pad` lets through `+ * # ,`
      // which we don't want stored.
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setLocal(digitsOnly);
  }, []);

  const enteredDigits = local.replace(/^0+/, '').length;
  const canContinue = enteredDigits >= country.nsnLength;

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
              onChangeText={handleChange}
              maxLength={country.nsnLength + 1}
              placeholder="enter number"
              autoFocus
              leadingPrefix={
                <InputPrefix onPress={() => setPickerOpen(true)}>
                  <Text style={styles.flag}>{country.flag}</Text>
                  <Text style={styles.prefixText}>{country.dialCode}</Text>
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
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              mutate(toE164(country, local));
            }}
          />
        </View>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setCountry}
        selectedCode={country.code}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },
  field: { marginTop: spacing.xl },
  flag: { fontSize: 18, marginRight: spacing.sm },
  prefixText: { ...typography.prefix, color: colors.text.secondaryStrong },
  footer: { paddingHorizontal: spacing.screenPadding },
});
