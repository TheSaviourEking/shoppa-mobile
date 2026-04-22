import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, radii, spacing } from '@/theme';

interface Props {
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
}

/**
 * Top row used by every auth screen — back button on the left, progress bar
 * on the right. Renders nothing for steps if step/totalSteps aren't passed.
 */
export function ScreenHeader({ step, totalSteps, onBack, showBack = true }: Props): React.JSX.Element {
  const handleBack = (): void => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
        >
          <ChevronLeftIcon size={20} color={colors.text.primary} strokeWidth={2} />
        </Pressable>
      ) : (
        <View style={styles.backCircle} />
      )}

      {step !== undefined && totalSteps !== undefined ? (
        <ProgressBar step={step} totalSteps={totalSteps} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
