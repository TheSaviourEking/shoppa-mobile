import { StyleSheet, View } from 'react-native';
import { colors, radii } from '@/theme';

interface Props {
  /** 1-based current step */
  step: number;
  totalSteps: number;
  /** 'pills' for the auth flow (3×28 purple pills); 'line' for the post flow (continuous green bar) */
  variant?: 'pills' | 'line';
}

/**
 * Top-right progress indicator. Two visual variants:
 *  - pills: three purple pills (auth signup)
 *  - line:  one continuous bar with a green filled portion (post-creation flow)
 */
export function ProgressBar({ step, totalSteps, variant = 'pills' }: Props): React.JSX.Element {
  if (variant === 'line') {
    const percent = Math.max(0, Math.min(1, step / totalSteps));
    return (
      <View
        style={styles.lineTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: totalSteps, now: step }}
      >
        <View style={[styles.lineFill, { width: `${percent * 100}%` }]} />
      </View>
    );
  }

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

  lineTrack: {
    width: 120,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border.base,
    overflow: 'hidden',
  },
  lineFill: {
    height: '100%',
    backgroundColor: colors.status.success,
    borderRadius: 3,
  },
});
