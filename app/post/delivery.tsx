import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, spacing, typography } from '@/theme';

export default function DeliveryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = usePostFlow();
  const [address, setAddress] = useState(flow.deliveryAddress);

  const onContinue = (): void => {
    flow.setDeliveryAddress(address.trim());
    // Next slice: push /post/review (16-review).
  };

  const canContinue = address.trim().length > 0;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.padded}>
          <ScreenHeader step={6} totalSteps={6} progressVariant="line" />

          <Text style={styles.title}>Add a delivery address</Text>
          <Text style={styles.subtitle}>This where your order will be delivered to</Text>

          <Text style={styles.label}>Delivery address</Text>
          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <LocationPinIcon size={20} color={colors.text.tertiary} />
            </View>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="enter your address"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Continue" disabled={!canContinue} onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
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
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface.muted,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  prefix: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border.base,
    backgroundColor: colors.border.base,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: colors.text.primary,
  },

  footer: { paddingHorizontal: spacing.screenPadding },
});
