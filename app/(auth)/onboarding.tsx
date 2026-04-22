import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppleIcon } from '@/components/icons/AppleIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { ShoppaLogo } from '@/components/icons/ShoppaLogo';
import { Button } from '@/components/Button';
import { CloudBlobsBackground } from '@/components/decor/CloudBlobsBackground';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/theme';

// Metro returns a numeric asset id for require()'d images; cast to ImageSource for type safety.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const HERO_IMAGE: ImageSource = require('../../assets/images/splash/onboarding-hero.png') as ImageSource;

export default function OnboardingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const onSignup = (): void => router.push('/(auth)/phone');
  const onLogin = (): void => router.push('/(auth)/phone');

  return (
    <Screen background={colors.brand.primary} padded={false} edges={['bottom']}>
      <CloudBlobsBackground />

      {/* Hero circle — figma coords: top 157, left 83, 224×205, radius full, bg #F5F5F5. */}
      <View style={styles.heroCircle}>
        <Image source={HERO_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
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
  heroCircle: {
    position: 'absolute',
    top: 157,
    left: 83,
    width: 224,
    height: 205,
    borderRadius: 9999,
    backgroundColor: colors.surface.muted,
    overflow: 'hidden',
  },

  headlineBlock: {
    // hero ends at y=362 (top 157 + height 205); start the eyebrow ~20px below.
    marginTop: 382,
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: 4,
  },
  eyebrow: {
    ...typography.eyebrow,
    // Figma: #FFFFFF at 62% opacity (renders as muted purple over the brand bg).
    color: 'rgba(255, 255, 255, 0.62)',
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

  // Figma: Onest 600 12 / 150% center, white at 62%; bold-underlined spans full white.
  legal: {
    ...typography.captionSemibold,
    color: 'rgba(255, 255, 255, 0.62)',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  legalLink: {
    fontFamily: 'Onest_700Bold',
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.onBrand,
    textDecorationLine: 'underline',
  },
});
