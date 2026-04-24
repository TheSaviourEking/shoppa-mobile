import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { WelcomeBlobsBackground } from '@/components/decor/WelcomeBlobsBackground';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { SuccessBloomIcon } from '@/components/icons/SuccessBloomIcon';
import { Screen } from '@/components/Screen';
import { usePostFlow } from '@/store/postFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const STEPS = ['Shoppers will make offers', 'Accept an offer', 'Fund your escrow wallet and get your items'];

const BLOOM_SIZE = 110;

export default function SuccessScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const reset = usePostFlow((s) => s.reset);

  const onGoToPost = (): void => {
    reset();
    router.replace('/(tabs)');
  };

  return (
    <Screen background={colors.brand.primary} padded={false}>
      <WelcomeBlobsBackground />

      <View style={styles.stage}>
        {/* Bloom pinned to the exact viewport vertical center — translateY
            pulls its center (not its top) onto the 50% line. */}
        <View style={styles.bloomAnchor}>
          <View style={styles.bloom}>
            <SuccessBloomIcon size={BLOOM_SIZE} />
            <View style={styles.checkOverlay}>
              <View style={styles.check}>
                <CheckIcon size={20} color={colors.brand.primary} strokeWidth={3} />
              </View>
            </View>
          </View>
        </View>

        {/* Text + numbered steps start right under the bloom. */}
        <View style={styles.copyAnchor}>
          <Text style={styles.title}>Posted Successfully!</Text>
          <Text style={styles.subtitle}>
            Your shopping list has been posted.{'\n'}Here{"'"}s what{"'"}s next
          </Text>

          <View style={styles.steps}>
            {STEPS.map((line, i) => (
              <View key={line} style={styles.stepRow}>
                <View style={styles.stepBullet}>
                  <Text style={styles.stepBulletText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{line}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button variant="secondary" label="Go to my Post" onPress={onGoToPost} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1 },

  bloomAnchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -BLOOM_SIZE / 2,
    alignItems: 'center',
  },
  bloom: {
    width: BLOOM_SIZE,
    height: BLOOM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },

  copyAnchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: BLOOM_SIZE / 2 + spacing.xl,
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
  },

  title: {
    ...typography.h2,
    color: colors.text.onBrand,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 21.7,
    letterSpacing: -0.21,
    color: colors.text.onBrand,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  steps: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBulletText: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 12,
    color: colors.brand.primary,
  },
  stepText: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.text.onBrand,
  },

  footer: { paddingHorizontal: spacing.screenPadding },
});
