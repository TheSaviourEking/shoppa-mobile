import { forwardRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

interface Props extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  leadingPrefix?: ReactNode;
  trailing?: ReactNode;
  containerStyle?: object;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, hint, error, leadingPrefix, trailing, containerStyle, ...rest },
  ref,
): React.JSX.Element {
  return (
    <View style={containerStyle}>
      {label || hint ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      ) : null}

      <View style={[styles.field, error ? styles.fieldError : null]}>
        {leadingPrefix ? <View style={styles.prefix}>{leadingPrefix}</View> : null}
        <TextInput
          ref={ref}
          {...rest}
          placeholderTextColor={colors.text.hint}
          style={[styles.input, leadingPrefix ? styles.inputAfterPrefix : null]}
        />
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

interface PrefixProps {
  children: ReactNode;
  onPress?: () => void;
}

/**
 * Country-prefix box (the "+234" pill on the phone screen). Shares the input's
 * 56pt height and bg, separated by a thin divider.
 */
export function InputPrefix({ children, onPress }: PrefixProps): React.JSX.Element {
  const Container = onPress ? Pressable : View;
  return (
    <Container onPress={onPress} style={styles.prefixBox}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  label: { ...typography.label, color: colors.text.primary },
  hint: { ...typography.caption, color: colors.text.tertiary },

  field: {
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.surface.muted,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fieldError: { borderWidth: 1.5, borderColor: colors.status.error },
  prefix: { paddingLeft: 0, paddingVertical: 0 },
  prefixBox: {
    height: '100%',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyLarge,
    color: colors.text.primary,
  },
  inputAfterPrefix: { paddingLeft: spacing.md },
  trailing: { paddingRight: spacing.lg },
  errorText: { ...typography.caption, color: colors.status.error, marginTop: spacing.xs },
});
