import { StyleSheet, View } from 'react-native';
import { colors, radii } from '@/theme';

interface Props {
  /** 1-based current step */
  step: number;
  totalSteps: number;
}

/**
 * The 3-pill progress indicator the auth flow uses (top-right of every step).
 * Each pill is 80×6, rounded 3, 4px gap. Filled pills use brand purple.
 */
export function ProgressBar({ step, totalSteps }: Props): React.JSX.Element {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: totalSteps, now: step }}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const filled = i < step;
        return (
          <View
            key={i}
            style={[styles.pill, { backgroundColor: filled ? colors.brand.primary : colors.border.base }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pill: { width: 28, height: 6, borderRadius: radii.xs },
});
