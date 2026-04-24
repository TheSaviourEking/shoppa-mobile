import { useEffect, useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface Props {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  hasError?: boolean;
  autoFocus?: boolean;
}

/**
 * Six-cell OTP entry. The visible boxes are decorative — a single hidden
 * TextInput captures all keystrokes so iOS's autofill-from-SMS works without
 * fighting per-cell focus management.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  autoFocus = true,
}: Props): React.JSX.Element {
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    if (!autoFocus) return;
    // Slight delay so Android opens the keyboard after the screen has
    // mounted — focusing too early can be a no-op on some devices.
    const t = setTimeout(() => ref.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const focusInput = (): void => {
    // If the field is already focused but the soft keyboard was dismissed,
    // calling focus() again is a no-op — toggle visibility manually.
    if (ref.current?.isFocused()) {
      Keyboard.dismiss();
      requestAnimationFrame(() => ref.current?.focus());
    } else {
      ref.current?.focus();
    }
  };

  return (
    <Pressable style={styles.row} onPress={focusInput} accessibilityRole="none">
      {Array.from({ length }, (_, i) => {
        const char = value[i] ?? '';
        const isCurrent = i === value.length;
        const showCaret = isCurrent && !char;
        return (
          <View key={i} style={[styles.cell, hasError && styles.cellError]}>
            {showCaret ? <View style={styles.caret} /> : null}
            {char ? <Text style={styles.cellText}>{char}</Text> : null}
          </View>
        );
      })}

      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        style={styles.hidden}
        caretHidden
        // showSoftInputOnFocus defaults to true, but be explicit for Android.
        showSoftInputOnFocus
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 50,
    borderRadius: radii.md,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
    // 1.5px transparent border keeps the layout slot reserved so the error
    // state (which swaps this to red) doesn't shift the cell on toggle.
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  cellError: { borderColor: colors.status.error },
  cellText: { ...typography.bodyLargeSemibold, color: colors.text.secondaryStrong },
  caret: { width: 1.5, height: 22, backgroundColor: colors.brand.primary },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});
