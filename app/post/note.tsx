import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, spacing, typography } from '@/theme';

export default function NoteScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = usePostFlow();
  const [note, setNote] = useState(flow.note);

  const onContinue = (): void => {
    flow.setNote(note.trim());
    router.push('/post/budget');
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.padded}>
          <ScreenHeader step={4} totalSteps={6} progressVariant="line" />

          <Text style={styles.title}>Add a Note</Text>
          <Text style={styles.subtitle}>You can describe any extra things you need.</Text>

          <Text style={styles.label}>Note</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="enter note/description"
            placeholderTextColor={colors.text.tertiary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Continue" onPress={onContinue} />
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
  input: {
    marginTop: spacing.sm,
    minHeight: 100,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface.muted,
    ...typography.body,
    color: colors.text.primary,
  },

  footer: { paddingHorizontal: spacing.screenPadding },
});
