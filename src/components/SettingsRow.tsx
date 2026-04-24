import { Pressable, StyleSheet, Switch, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { colors, fontFamilies } from '@/theme';

interface BaseProps {
  icon: React.ReactNode;
  label: string;
  style?: StyleProp<ViewStyle>;
}

interface NavRowProps extends BaseProps {
  onPress: () => void;
  trailing?: 'chevron' | 'none';
  rightLabel?: string;
}

interface ToggleRowProps extends BaseProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function SettingsRow({
  icon,
  label,
  onPress,
  trailing = 'chevron',
  rightLabel,
  style,
}: NavRowProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed, style]}
    >
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {rightLabel ? <Text style={styles.rightLabel}>{rightLabel}</Text> : null}
      {trailing === 'chevron' ? (
        <ChevronRightIcon size={20} color={colors.text.hint} strokeWidth={1.6} />
      ) : null}
    </Pressable>
  );
}

export function SettingsToggleRow({
  icon,
  label,
  value,
  onValueChange,
  style,
}: ToggleRowProps): React.JSX.Element {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E8E8E8', true: '#34C759' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E8E8E8"
      />
    </View>
  );
}

export function SettingsSectionHeader({ title }: { title: string }): React.JSX.Element {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowPressed: { opacity: 0.75 },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.primary,
  },
  rightLabel: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: colors.text.tertiary,
  },
  sectionHeader: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.hint,
    marginTop: 12,
    marginBottom: 4,
  },
});
