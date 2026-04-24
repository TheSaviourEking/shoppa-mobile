import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SHEET_ENTER, SHEET_EXIT } from '@/lib/sheet-animations';
import type { InstalmentsCount } from '@/store/postFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

interface Props {
  visible: boolean;
  initialInstalments: InstalmentsCount;
  onClose: () => void;
  onCommit: (count: InstalmentsCount) => void;
}

export function InstalmentsSheet({
  visible,
  initialInstalments,
  onClose,
  onCommit,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState(initialInstalments > 1);
  const [count, setCount] = useState<InstalmentsCount>(initialInstalments > 1 ? initialInstalments : 2);

  const onSkip = (): void => {
    onCommit(enabled ? count : 1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        entering={SHEET_ENTER}
        exiting={SHEET_EXIT}
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Instalments</Text>
          <Pressable
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip instalments"
            style={({ pressed }) => [styles.skipBtn, pressed && styles.pressed]}
          >
            <Text style={styles.skipLabel}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Pay in Instalments</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.border.base, true: colors.status.success }}
            thumbColor={colors.surface.base}
            ios_backgroundColor={colors.border.base}
          />
        </View>

        {enabled ? (
          <View style={styles.optionsRow}>
            {([2, 3] as const).map((n) => {
              const selected = count === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => {
                    setCount(n);
                    onCommit(n);
                    onClose();
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [
                    styles.option,
                    selected ? styles.optionSelected : styles.optionUnselected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      selected ? styles.optionLabelSelected : styles.optionLabelUnselected,
                    ]}
                  >
                    {n} Instalments
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h5, color: colors.text.primary },
  skipBtn: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: colors.text.onBrand,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { ...typography.bodyLarge, color: colors.text.primary },

  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  option: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: { borderColor: colors.status.success, backgroundColor: colors.surface.base },
  optionUnselected: { borderColor: colors.border.base, backgroundColor: colors.surface.base },
  optionLabel: { fontFamily: fontFamilies.bodySemibold, fontSize: 14 },
  optionLabelSelected: { color: colors.status.success },
  optionLabelUnselected: { color: colors.text.primary },

  pressed: { opacity: 0.85 },
});
