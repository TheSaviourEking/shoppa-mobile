import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Address, formatAddressLine } from '@/api/addresses';
import { Button } from '@/components/Button';
import { DeliverySheet } from '@/components/DeliverySheet';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, spacing, typography } from '@/theme';

export default function DeliveryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  // Select only the slices we read so unrelated postFlow changes don't
  // re-render this screen (and cascade into the sheet).
  const deliveryAddress = usePostFlow((s) => s.deliveryAddress);
  const setDeliveryAddress = usePostFlow((s) => s.setDeliveryAddress);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const onSelect = useCallback(
    (addr: Address): void => {
      setDeliveryAddress({ id: addr.id, line: formatAddressLine(addr) });
      setSheetOpen(false);
    },
    [setDeliveryAddress],
  );

  const onContinue = useCallback((): void => {
    if (!deliveryAddress) return;
    router.push('/post/review');
  }, [deliveryAddress]);

  const canContinue = !!deliveryAddress;

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader step={6} totalSteps={6} progressVariant="line" />

        <Text style={styles.title}>Add a delivery address</Text>
        <Text style={styles.subtitle}>This where your order will be delivered to</Text>

        <Text style={styles.label}>Delivery address</Text>
        <Pressable
          onPress={openSheet}
          style={({ pressed }) => [styles.inputRow, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Pick delivery address"
        >
          <View style={styles.prefix}>
            <LocationPinIcon size={20} color={colors.text.tertiary} />
          </View>
          {deliveryAddress ? (
            <Text style={styles.value} numberOfLines={2}>
              {deliveryAddress.line}
            </Text>
          ) : (
            <Text style={styles.placeholder}>enter your address</Text>
          )}
        </Pressable>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Continue" disabled={!canContinue} onPress={onContinue} />
      </View>

      <DeliverySheet visible={sheetOpen} onClose={closeSheet} onSelect={onSelect} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  label: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    marginTop: spacing.xl,
  },
  inputRow: {
    marginTop: spacing.sm,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.surface.muted,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  prefix: {
    width: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border.base,
    backgroundColor: colors.border.base,
  },
  placeholder: {
    ...typography.body,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  value: {
    ...typography.body,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flex: 1,
  },

  pressed: { opacity: 0.85 },

  footer: { paddingHorizontal: spacing.screenPadding },
});
