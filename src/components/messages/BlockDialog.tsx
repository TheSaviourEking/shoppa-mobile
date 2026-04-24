import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamilies } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

export function BlockDialog({ visible, onClose, onConfirm, pending = false }: Props): React.JSX.Element {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="fade" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={pending ? undefined : onClose} />
      <View style={styles.dialog}>
        <View style={styles.body}>
          <Text style={styles.title}>Block Messages</Text>
          <Text style={styles.copy}>
            This will disable any communication in this chat. You cannot reverse this action. Are you sure you
            want to block messages?
          </Text>
        </View>
        <View style={styles.divider} />
        <Pressable
          accessibilityRole="button"
          onPress={onConfirm}
          disabled={pending}
          style={({ pressed }) => [styles.action, pressed && !pending && styles.pressed]}
        >
          <Text style={[styles.actionLabel, styles.destructive]}>
            {pending ? 'Blocking…' : 'Yes, block messages'}
          </Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          disabled={pending}
          style={({ pressed }) => [styles.action, pressed && !pending && styles.pressed]}
        >
          <Text style={[styles.actionLabel, styles.cancel]}>No, cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,1,32,0.4)' },
  dialog: {
    position: 'absolute',
    left: 32,
    right: 32,
    top: '36%',
    backgroundColor: '#3C3C3C',
    borderRadius: 14,
    overflow: 'hidden',
  },
  body: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14, alignItems: 'center' },
  title: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  copy: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#5A5A5A' },
  action: { height: 48, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: fontFamilies.bodySemibold, fontSize: 16 },
  destructive: { color: '#FF453A' },
  cancel: { color: '#0A84FF' },
  pressed: { opacity: 0.85 },
});
