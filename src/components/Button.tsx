import { Pressable, type PressableProps, StyleSheet, Text, View, type ViewStyle } from 'react-native';
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

export function Button({
  label,
  variant = 'primary',
  fullWidth = true,
  loading = false,
  leadingIcon,
  disabled,
  style,
  ...rest
}: Props): React.JSX.Element {
  const isDisabled = disabled === true || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        VARIANT_STYLES[variant].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.row}>
        {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
        <Text style={[styles.label, VARIANT_STYLES[variant].label]} numberOfLines={1}>
          {loading ? '…' : label}
        </Text>
      </View>
    </Pressable>
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
  pressed: { opacity: 0.85 },
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
