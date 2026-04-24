import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onBlock: () => void;
}

export function ConversationActionSheet({ visible, onClose, onBlock }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Block messages"
          onPress={() => {
            onClose();
            onBlock();
          }}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={[styles.label, styles.destructive]}>Block Messages</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={onClose}
          style={({ pressed }) => [styles.action, styles.cancel, pressed && styles.pressed]}
        >
          <Text style={[styles.label, styles.cancelLabel]}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,1,32,0.4)' },
  sheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    gap: 12,
  },
  action: {
    height: 64,
    borderRadius: 16,
    backgroundColor: '#3C3C3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {},
  label: { fontFamily: fontFamilies.bodySemibold, fontSize: 16 },
  destructive: { color: '#FF453A' },
  cancelLabel: { color: '#0A84FF' },
  pressed: { opacity: 0.85 },
});
