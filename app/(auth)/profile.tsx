import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { UserAvatarIcon } from '@/components/icons/UserAvatarIcon';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useSignupFlow } from '@/store/signupFlow';
import { colors, spacing, typography } from '@/theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export default function ProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = useSignupFlow();

  const [firstName, setFirst] = useState(flow.firstName);
  const [lastName, setLast] = useState(flow.lastName);
  const [email, setEmail] = useState(flow.email);
  const [password, setPassword] = useState(flow.password);
  const [showPassword, setShowPassword] = useState(false);

  const valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    EMAIL_RE.test(email.trim()) &&
    password.length >= MIN_PASSWORD;

  const onContinue = (): void => {
    flow.set({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });
    router.push('/(auth)/goal');
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.padded}>
            <ScreenHeader step={2} totalSteps={3} />

            <Text style={styles.title}>Create a Profile</Text>
            <Text style={styles.subtitle}>
              Let{"'"}s begin with the essentials. Fill in your basic details to get started
            </Text>

            <View style={styles.avatarBlock}>
              <View style={styles.avatarCircle}>
                <UserAvatarIcon size={70} color={colors.text.hint} />
              </View>
              <Text style={styles.addImageLink}>Add image</Text>
            </View>

            <View style={styles.row}>
              <Input
                label="First name"
                placeholder="enter name"
                value={firstName}
                onChangeText={setFirst}
                autoCapitalize="words"
                containerStyle={styles.col}
              />
              <Input
                label="Last name"
                placeholder="enter name"
                value={lastName}
                onChangeText={setLast}
                autoCapitalize="words"
                containerStyle={styles.col}
              />
            </View>

            <View style={styles.fieldSpacer}>
              <Input
                label="Email"
                placeholder="enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.fieldSpacer}>
              <Input
                label="Password"
                hint={`${MIN_PASSWORD}+ characters`}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                trailing={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    <EyeOffIcon size={20} color={colors.text.tertiary} />
                  </Pressable>
                }
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Continue" disabled={!valid} onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  padded: { paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  avatarBlock: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addImageLink: { ...typography.cta, color: colors.status.link, marginTop: spacing.sm },

  row: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  fieldSpacer: { marginTop: spacing.lg },

  footer: { paddingHorizontal: spacing.screenPadding },
});
