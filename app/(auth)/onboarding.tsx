import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { GlobeHero } from '@/components/decor/GlobeHero';
import { AppleIcon } from '@/components/icons/AppleIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { ShopperBagIcon } from '@/components/icons/ShopperBagIcon';
import { fontFamilies, typography } from '@/theme';

/*
 * ── Previous Shoppa onboarding screen (kept for reference) ───────────────
 *
 * import { Image, type ImageSource } from 'expo-image';
 * import { router } from 'expo-router';
 * import { StyleSheet, Text, View } from 'react-native';
 * import { useSafeAreaInsets } from 'react-native-safe-area-context';
 * import { AppleIcon } from '@/components/icons/AppleIcon';
 * import { GoogleIcon } from '@/components/icons/GoogleIcon';
 * import { ShoppaLogo } from '@/components/icons/ShoppaLogo';
 * import { Button } from '@/components/Button';
 * import { CloudBlobsBackground } from '@/components/decor/CloudBlobsBackground';
 * import { Screen } from '@/components/Screen';
 * import { colors, spacing, typography } from '@/theme';
 *
 * // eslint-disable-next-line @typescript-eslint/no-require-imports
 * const HERO_IMAGE: ImageSource = require('../../assets/images/splash/onboarding-hero.png') as ImageSource;
 *
 * export default function OnboardingScreen(): React.JSX.Element {
 *   const insets = useSafeAreaInsets();
 *   const onSignup = (): void => router.push('/(auth)/email');
 *   const onLogin = (): void => router.push('/(auth)/email');
 *
 *   return (
 *     <Screen background={colors.brand.primary} padded={false} edges={['bottom']}>
 *       <CloudBlobsBackground />
 *       <View style={styles.heroCircle}>
 *         <Image source={HERO_IMAGE} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
 *       </View>
 *       <View style={styles.headlineBlock}>
 *         <ShoppaLogo size={28} color={colors.text.onBrand} />
 *         <Text style={styles.eyebrow}>Welcome to Shoppa</Text>
 *         <Text style={styles.headline}>Post What You Need</Text>
 *         <Text style={styles.headline}>Let Shoppers Do the Rest</Text>
 *       </View>
 *       <View style={[styles.ctaBlock, { paddingBottom: insets.bottom + spacing.lg }]}>
 *         <Button variant="secondary" label="Sign up with Apple" leadingIcon={<AppleIcon size={18} color={colors.text.primary} />} onPress={onSignup} />
 *         <Button variant="secondary" label="Sign up with Google" leadingIcon={<GoogleIcon size={18} color={colors.text.primary} />} onPress={onSignup} />
 *         <View style={styles.splitRow}>
 *           <Button variant="translucent" label="Login" onPress={onLogin} style={styles.splitBtn} />
 *           <Button variant="secondary" label="Sign Up" onPress={onSignup} style={styles.splitBtn} />
 *         </View>
 *         <Text style={styles.legal}>
 *           By continuing, you are agreeing to our{' '}
 *           <Text style={styles.legalLink} onPress={() => undefined}>Terms and Conditions</Text>
 *           {' and '}
 *           <Text style={styles.legalLink} onPress={() => undefined}>Privacy Policy</Text>
 *         </Text>
 *       </View>
 *     </Screen>
 *   );
 * }
 */

const SHEET_BG = '#121212';
const TITLE_GLOW = '#8A3CE3';
const DIVIDER = '#2C2C2C';
const LOGIN_BG = '#2C2C2C';
const MUTED_TEXT = '#A3A3A3';
const FAINT_TEXT = '#808080';

export default function OnboardingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const onSignup = (): void => router.push('/(auth)/email');
  const onLogin = (): void => router.push('/(auth)/email');

  return (
    <View style={styles.root}>
      <View style={[styles.globeArea, { paddingTop: insets.top }]}>
        <GlobeHero />
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.hero}>
          <ShopperBagIcon size={32} color="#FFFFFF" />

          <View style={styles.titleWrap}>
            <Text style={[styles.title, styles.titleGlowFar]}>The right way to{'\n'}celebrate anything.</Text>
            <Text style={[styles.title, styles.titleGlowNear, StyleSheet.absoluteFill]}>
              The right way to{'\n'}celebrate anything.
            </Text>
            <Text style={[styles.title, styles.titleCore, StyleSheet.absoluteFill]}>
              The right way to{'\n'}celebrate anything.
            </Text>
          </View>

          <Text style={styles.subtitle}>
            From discovering what{"'"}s happening, to planning your own, to sending the perfect gift — Shoppa
            brings it all together.
          </Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.socialRow}>
            <Button
              style={styles.socialButton}
              variant="secondary"
              label="Google"
              leadingIcon={<GoogleIcon size={20} />}
              onPress={onSignup}
              fullWidth={false}
            />
            <Button
              style={styles.socialButton}
              variant="secondary"
              label="Apple"
              leadingIcon={<AppleIcon size={20} color="#1A1A1A" />}
              onPress={onSignup}
              fullWidth={false}
            />
          </View>

          <Button variant="secondary" label="Sign up with Email" onPress={onSignup} />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onLogin}
            style={({ pressed }) => [styles.loginBtn, pressed && styles.loginBtnPressed]}
          >
            <Text style={styles.loginBtnLabel}>Login to continue</Text>
          </Pressable>

          <Text style={styles.terms}>
            By continuing you agree to accept our <Text style={styles.termsLink}>Terms of Use</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SHEET_BG,
  },
  // Figma frame is 932 tall: globe 0→348, sheet 348→932. The globe gets an
  // explicit 37% so the sheet can't be squeezed to zero height if the globe
  // child (which fills via flex: 1) tries to grow unbounded. Sheet takes the
  // remainder with flex: 1.
  globeArea: { height: '37%' },
  sheet: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 2,
    borderTopColor: '#2C2C2C',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },

  // ── Title (Owambe Sans Extended Black 28/110%/-1%) ──────────────────────
  // Glow is built by stacking three absolutely-positioned Text layers: a far
  // purple halo, a tight purple halo, and a crisp white top layer.
  titleWrap: { marginTop: 24, alignSelf: 'stretch' },
  title: {
    fontFamily: 'OwambeSansExt-Black',
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.28,
    textAlign: 'center',
  },
  titleGlowFar: {
    color: TITLE_GLOW,
    textShadowColor: TITLE_GLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
    opacity: 0.9,
  },
  titleGlowNear: {
    color: TITLE_GLOW,
    textShadowColor: TITLE_GLOW,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleCore: {
    color: '#FFFFFF',
  },

  subtitle: {
    ...typography.bodyLarge,
    color: MUTED_TEXT,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 340,
  },

  actions: { gap: 16 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: { flex: 1, paddingHorizontal: 16 },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: DIVIDER },
  dividerLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: MUTED_TEXT,
  },

  loginBtn: {
    height: 56,
    borderRadius: 999,
    backgroundColor: LOGIN_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnPressed: { opacity: 0.85 },
  loginBtnLabel: { ...typography.cta, color: '#FFFFFF' },

  terms: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    lineHeight: 18,
    color: FAINT_TEXT,
    textAlign: 'center',
    marginTop: 8,
  },
  termsLink: {
    color: '#FFFFFF',
    fontFamily: fontFamilies.bodySemibold,
  },
});
