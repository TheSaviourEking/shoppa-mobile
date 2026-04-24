import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { ImagePlaceholderIcon } from '@/components/icons/ImagePlaceholderIcon';
import { SHEET_ENTER, SHEET_EXIT } from '@/lib/sheet-animations';
import { colors, fontFamilies, spacing, typography } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; imageUri: string | null; imageMime: string | null }) => void;
}

export function ItemAddSheet({ visible, onClose, onAdd }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setName('');
      setImageUri(null);
      setImageMime(null);
    }
  }, [visible]);

  const onPickImage = async (): Promise<void> => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo library access so you can attach an item image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setImageMime(result.assets[0].mimeType ?? null);
    }
  };

  const onSubmit = (): void => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ name: trimmed, imageUri, imageMime });
    onClose();
  };

  const canSubmit = name.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        entering={SHEET_ENTER}
        exiting={SHEET_EXIT}
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Item</Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
          >
            <CloseIcon size={16} color={colors.text.primary} />
          </Pressable>
        </View>

        <Text style={styles.label}>Item name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="enter name"
          placeholderTextColor={colors.text.tertiary}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />

        <Pressable
          onPress={onPickImage}
          style={({ pressed }) => [styles.imageBox, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={imageUri ? 'Change item image' : 'Add item image'}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imageRow}>
              <ImagePlaceholderIcon size={20} color={colors.text.tertiary} />
              <Text style={styles.imageLabel}>
                Add item image <Text style={styles.imageOptional}>(optional)</Text>
              </Text>
            </View>
          )}
        </Pressable>

        <Button label="Add Item" disabled={!canSubmit} onPress={onSubmit} />
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
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: { ...typography.bodySemibold, color: colors.text.primary },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.muted,
    ...typography.body,
    color: colors.text.primary,
  },

  imageBox: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border.base,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  imageLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: colors.text.primary,
  },
  imageOptional: {
    fontFamily: fontFamilies.body,
    color: colors.text.tertiary,
  },
  imagePreview: { width: '100%', height: '100%' },

  pressed: { opacity: 0.85 },
});
