import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppleIcon } from '@/components/icons/AppleIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { ShoppaLogo } from '@/components/icons/ShoppaLogo';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/theme';

export default function OnboardingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const onSignup = (): void => router.push('/(auth)/phone');
  const onLogin = (): void => router.push('/(auth)/phone');

  return (
    <Screen background={colors.brand.primary} padded={false}>
      <View style={styles.heroWrap}>
        {/*
         * Placeholder for the onboarding hero photo. Drop the real image at
         * assets/images/splash/onboarding-hero.png (see MANIFEST.md) and swap
         * this View for an <Image source={require('...')}/>.
         */}
        <View style={styles.heroCircle} />
      </View>

      <View style={styles.headlineBlock}>
        <ShoppaLogo size={28} color={colors.text.onBrand} />
        <Text style={styles.eyebrow}>Welcome to Shoppa</Text>
        <Text style={styles.headline}>Post What You Need</Text>
        <Text style={styles.headline}>Let Shoppers Do the Rest</Text>
      </View>

      <View style={[styles.ctaBlock, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          variant="secondary"
          label="Sign up with Apple"
          leadingIcon={<AppleIcon size={18} color={colors.text.primary} />}
          onPress={onSignup}
        />
        <Button
          variant="secondary"
          label="Sign up with Google"
          leadingIcon={<GoogleIcon size={18} />}
          onPress={onSignup}
        />
        <View style={styles.splitRow}>
          <Button variant="translucent" label="Login" onPress={onLogin} style={styles.splitBtn} />
          <Button variant="secondary" label="Sign Up" onPress={onSignup} style={styles.splitBtn} />
        </View>

        <Text style={styles.legal}>
          By continuing, you are agreeing to our{' '}
          <Text style={styles.legalLink} onPress={() => undefined}>
            Terms and Conditions
          </Text>
          {' and '}
          <Text style={styles.legalLink} onPress={() => undefined}>
            Privacy Policy
          </Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', marginTop: spacing.xxl + spacing.lg },
  heroCircle: {
    width: 224,
    height: 205,
    borderRadius: 999,
    backgroundColor: colors.surface.muted,
    overflow: 'hidden',
  },

  headlineBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenPadding,
    gap: 4,
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.brand.onPurpleMuted,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headline: { ...typography.hero, color: colors.text.onBrand, textAlign: 'center' },

  ctaBlock: {
    marginTop: 'auto',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  splitRow: { flexDirection: 'row', gap: spacing.sm },
  splitBtn: { flex: 1, paddingHorizontal: 0 },

  legal: {
    ...typography.caption,
    color: colors.brand.onPurpleMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  legalLink: {
    ...typography.captionSemibold,
    color: colors.text.onBrand,
    textDecorationLine: 'underline',
  },
});
