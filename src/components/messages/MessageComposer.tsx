import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ImagePlaceholderIcon } from '@/components/icons/ImagePlaceholderIcon';
import { colors, fontFamilies } from '@/theme';

interface Props {
  value: string;
  onChange: (next: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MessageComposer({
  value,
  onChange,
  onSend,
  onPickImage,
  placeholder = 'Message',
  disabled = false,
}: Props): React.JSX.Element {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.root}>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#A3A3A3"
          multiline
          editable={!disabled}
        />
      </View>

      <View style={styles.actionRow}>
        <Pressable
          onPress={onPickImage}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Attach photo"
          hitSlop={8}
          style={({ pressed }) => [styles.imageBtn, pressed && styles.pressed]}
        >
          <ImagePlaceholderIcon size={18} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          style={({ pressed }) => [
            styles.sendBtn,
            !canSend && styles.sendBtnDisabled,
            pressed && canSend && styles.pressed,
          ]}
        >
          <Text style={styles.sendLabel}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface.base,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 10,
  },
  inputWrap: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: '#3C3C3C',
    minHeight: 22,
    maxHeight: 110,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  imageBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    minWidth: 132,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 28,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#D5C2FC' },
  sendLabel: { fontFamily: fontFamilies.bodySemibold, fontSize: 14, color: '#FFFFFF' },
  pressed: { opacity: 0.85 },
});
