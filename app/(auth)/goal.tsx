import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { authApi } from '@/api/auth';
import { ErrorCode } from '@/api/error-codes';
import { meApi } from '@/api/me';
import { uploadImage } from '@/api/uploads';
import { Button } from '@/components/Button';
import { BagIcon } from '@/components/icons/BagIcon';
import { HandCoinsIcon } from '@/components/icons/HandCoinsIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuthStore } from '@/store/auth';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, spacing, typography } from '@/theme';

type Goal = 'BUY' | 'EARN';

export default function GoalScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = useSignupFlow();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [goal, setGoal] = useState<Goal | null>(flow.goal);

  const signup = useMutation({
    mutationFn: () => {
      if (!flow.signupToken) throw new Error('missing signup token');
      if (!flow.phone) throw new Error('missing phone number');
      return authApi.signup({
        signupToken: flow.signupToken,
        firstName: flow.firstName,
        lastName: flow.lastName,
        phone: flow.phone,
        password: flow.password,
        goal: goal ?? undefined,
      });
    },
    onSuccess: async (res) => {
      await setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });

      if (flow.avatarUri) {
        try {
          const upload = await uploadImage(flow.avatarUri, flow.avatarMime);
          await meApi.updateProfile({ avatarKey: upload.key });
        } catch (uploadErr) {
          // Avatar upload is best-effort — the account exists and the user
          // can retry from the account screen. Surface the issue without
          // blocking onboarding.
          console.warn('avatar upload failed', uploadErr);
        }
      }

      flow.reset();
      router.replace('/(auth)/welcome');
    },
    onError: (err) => {
      let msg: string;
      if (err instanceof ApiError) {
        if (err.code === ErrorCode.AUTH_EMAIL_IN_USE) {
          msg = 'That email is already registered.';
        } else if (err.code === ErrorCode.AUTH_PHONE_IN_USE) {
          msg = 'That phone is already registered.';
        } else if (err.code === ErrorCode.VALIDATION_ERROR) {
          // Backend wraps class-validator messages in details.errors as an
          // array of strings — surface the first few so the user can see
          // which field tripped the check.
          const errors = (err.details as { errors?: string[] } | undefined)?.errors;
          msg = errors?.length ? errors.slice(0, 3).join('\n') : err.message;
        } else {
          msg = err.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      } else {
        msg = 'Something went wrong';
      }
      Alert.alert('Could not create your account', msg);
    },
  });

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader step={3} totalSteps={3} />

        <Text style={styles.title}>What is your main goal on Shoppa?</Text>

        <View style={styles.options}>
          <GoalOption
            label="Buy stuff"
            icon={<BagIcon size={28} color={goal === 'BUY' ? colors.text.onBrand : colors.text.primary} />}
            selected={goal === 'BUY'}
            onPress={() => setGoal('BUY')}
          />
          <GoalOption
            label="Earn Money"
            icon={
              <HandCoinsIcon size={28} color={goal === 'EARN' ? colors.text.onBrand : colors.text.primary} />
            }
            selected={goal === 'EARN'}
            onPress={() => setGoal('EARN')}
          />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label="Continue"
          disabled={!goal}
          loading={signup.isPending}
          onPress={() => signup.mutate()}
        />
      </View>
    </Screen>
  );
}

interface OptionProps {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}

function GoalOption({ label, icon, selected, onPress }: OptionProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && !selected && styles.pressed,
      ]}
    >
      {icon}
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  padded: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: {
    ...typography.hero,
    color: colors.text.secondaryStrong,
    marginTop: spacing.xs,
  },

  options: { marginTop: spacing.xl, gap: spacing.md },
  option: {
    height: 118,
    borderRadius: 24,
    backgroundColor: colors.surface.muted,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  optionSelected: { backgroundColor: colors.brand.primary },
  optionLabel: { ...typography.cta, color: colors.text.primary },
  optionLabelSelected: { color: colors.text.onBrand },
  pressed: { opacity: 0.85 },

  footer: { paddingHorizontal: spacing.screenPadding },
});
