import { useCallback } from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'translucent' | 'tertiary';

interface Props extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Spring config tuned for a "tap" feel — decisive on press-in, quick bounce
// back on release. Damping high enough to prevent visible overshoot.
const SPRING = { damping: 18, stiffness: 320, mass: 0.6 };
const PRESSED_SCALE = 0.97;

export function Button({
  label,
  variant = 'primary',
  fullWidth = true,
  loading = false,
  leadingIcon,
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Props): React.JSX.Element {
  const isDisabled = disabled === true || loading;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (!isDisabled) scale.value = withSpring(PRESSED_SCALE, SPRING);
      onPressIn?.(e);
    },
    [isDisabled, onPressIn, scale],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      scale.value = withSpring(1, SPRING);
      onPressOut?.(e);
    },
    [onPressOut, scale],
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
      style={[
        styles.base,
        VARIANT_STYLES[variant].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
        animatedStyle,
      ]}
    >
      <View style={styles.row}>
        {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
        <Text style={[styles.label, VARIANT_STYLES[variant].label]} numberOfLines={1}>
          {loading ? '…' : label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  // Figma button spec: height 56, radius 999 (pill), padding 12/132/12/132,
  // gap 10 between leading icon and label.
  base: {
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  fullWidth: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: 10 },
  label: { ...typography.cta, textAlign: 'center' },
  disabled: { opacity: 0.55 },
});

const VARIANT_STYLES: Record<Variant, { container: ViewStyle; label: { color: string } }> = {
  primary: {
    container: { backgroundColor: colors.brand.primary },
    label: { color: colors.text.onBrand },
  },
  secondary: {
    container: { backgroundColor: colors.surface.base },
    label: { color: colors.text.primary },
  },
  translucent: {
    container: { backgroundColor: colors.surface.overlay },
    label: { color: colors.text.onBrand },
  },
  tertiary: {
    container: { backgroundColor: colors.surface.muted },
    label: { color: colors.text.primary },
  },
};
