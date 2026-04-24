import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { InstalmentsSheet } from '@/components/InstalmentsSheet';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { formatThousands } from '@/lib/number';
import { type InstalmentsCount, usePostFlow } from '@/store/postFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

// Backend stores budget as Decimal(14,2). 12 leading digits is the practical
// cap before the decimal — well past anything a buyer would type.
const MAX_BUDGET_DIGITS = 12;

export default function BudgetScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = usePostFlow();
  const [budget, setBudget] = useState(flow.budget);
  const [sheetOpen, setSheetOpen] = useState(false);

  const onChange = (text: string): void => {
    // Strip everything that isn't a digit — drops the commas the formatter
    // injected, plus anything else the soft keyboard might let through.
    const digits = text.replace(/\D/g, '').slice(0, MAX_BUDGET_DIGITS);
    // Trim leading zeros so the display doesn't say "0,005,000".
    setBudget(digits.replace(/^0+(?=\d)/, ''));
  };

  const onContinue = (): void => {
    if (!budget) return;
    flow.setBudget(budget);
    setSheetOpen(true);
  };

  const onCommitInstalments = (count: InstalmentsCount): void => {
    flow.setInstalments(count);
    router.push('/post/delivery');
  };

  const canContinue = budget.length > 0;

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.padded}>
          <ScreenHeader step={5} totalSteps={6} progressVariant="line" />

          <Text style={styles.title}>Enter Your budget</Text>
          <Text style={styles.subtitle}>
            Don{"'"}t worry, you can always negotiate the final price later.
          </Text>

          <Text style={styles.label}>Budget</Text>
          <View style={styles.inputRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixGlyph}>₦</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formatThousands(budget)}
              onChangeText={onChange}
              placeholder="enter your budget"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="number-pad"
              autoFocus
            />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Continue" disabled={!canContinue} onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>

      <InstalmentsSheet
        visible={sheetOpen}
        initialInstalments={flow.instalments}
        onClose={() => setSheetOpen(false)}
        onCommit={onCommitInstalments}
      />
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
  prefixGlyph: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    color: colors.text.primary,
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
