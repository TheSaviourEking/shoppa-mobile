import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
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
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <View style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const char = value[i] ?? '';
        const isCurrent = i === value.length;
        const showCaret = isCurrent && !char;
        return (
          <View
            key={i}
            style={[styles.cell, hasError && styles.cellError, isCurrent && !hasError && styles.cellActive]}
            onTouchEnd={() => ref.current?.focus()}
          >
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
      />
    </View>
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
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cellActive: { borderColor: colors.brand.primary },
  cellError: { borderColor: colors.status.error },
  cellText: { ...typography.h2, color: colors.text.primary },
  caret: { width: 1.5, height: 22, backgroundColor: colors.brand.primary },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});
