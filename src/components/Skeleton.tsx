import { useEffect } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';

interface Props {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pulsing-opacity skeleton block. Uses reanimated on the UI thread so the
 * animation keeps running even when JS is busy (image decoding, navigation,
 * re-renders from upstream state changes).
 *
 * Opacity pulse over a linear-gradient-looking color is intentional — it
 * avoids the cost of a real LinearGradient component and looks identical
 * at the animation's pulse speed.
 */
export function Skeleton({ width = '100%', height = 14, borderRadius = 6, style }: Props): React.JSX.Element {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.block, { width, height, borderRadius }, animatedStyle, style]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface.muted,
  },
});

/**
 * Render the same block `count` times with consistent spacing — the common
 * case for list-row skeletons (8 conversations, 6 transactions, etc).
 */
interface RepeatProps {
  count: number;
  renderItem: (index: number) => React.ReactNode;
  separator?: number;
}

export function SkeletonList({ count, renderItem, separator = 0 }: RepeatProps): React.JSX.Element {
  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={separator ? { marginBottom: separator } : undefined}>
          {renderItem(i)}
        </View>
      ))}
    </View>
  );
}
