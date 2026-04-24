import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { SHEET_ENTER, SHEET_EXIT } from '@/lib/sheet-animations';
import { ErrorCode } from '@/api/error-codes';
import { meApi } from '@/api/me';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { Input } from '@/components/Input';
import { colors, spacing, typography } from '@/theme';

const MIN_PASSWORD = 8;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ChangePasswordSheet({ visible, onClose }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    }
  }, [visible]);

  const mutation = useMutation({
    mutationFn: () => meApi.changePassword({ currentPassword: currentPw, newPassword: newPw }),
    onSuccess: () => {
      Alert.alert('Password changed', 'Other sessions have been signed out.');
      onClose();
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError && err.code === ErrorCode.AUTH_INVALID_CREDENTIALS
          ? 'Current password is incorrect.'
          : err instanceof ApiError && err.code === ErrorCode.AUTH_FORBIDDEN
            ? 'This account was created via Google/Apple — use Forgot Password to set one.'
            : err instanceof Error
              ? err.message
              : 'Could not change password. Try again.';
      Alert.alert('Change password failed', msg);
    },
  });

  const mismatches = newPw.length > 0 && confirmPw.length > 0 && newPw !== confirmPw;
  const canSubmit =
    currentPw.length > 0 && newPw.length >= MIN_PASSWORD && confirmPw === newPw && !mutation.isPending;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView style={styles.sheetWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View
          entering={SHEET_ENTER}
          exiting={SHEET_EXIT}
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
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

          <Input
            label="Current password"
            value={currentPw}
            onChangeText={setCurrentPw}
            secureTextEntry={!showCurrent}
            autoCapitalize="none"
            autoComplete="password"
            placeholder="••••••••"
            trailing={
              <Pressable onPress={() => setShowCurrent((v) => !v)} hitSlop={8}>
                {showCurrent ? (
                  <EyeIcon size={20} color={colors.text.tertiary} />
                ) : (
                  <EyeOffIcon size={20} color={colors.text.tertiary} />
                )}
              </Pressable>
            }
          />

          <Input
            label="New password"
            hint={`${MIN_PASSWORD}+ characters`}
            value={newPw}
            onChangeText={setNewPw}
            secureTextEntry={!showNew}
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder="••••••••"
            trailing={
              <Pressable onPress={() => setShowNew((v) => !v)} hitSlop={8}>
                {showNew ? (
                  <EyeIcon size={20} color={colors.text.tertiary} />
                ) : (
                  <EyeOffIcon size={20} color={colors.text.tertiary} />
                )}
              </Pressable>
            }
          />

          <Input
            label="Confirm new password"
            value={confirmPw}
            onChangeText={setConfirmPw}
            secureTextEntry={!showNew}
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder="••••••••"
            error={mismatches ? 'Passwords do not match' : undefined}
          />

          <Button
            label="Update password"
            disabled={!canSubmit}
            loading={mutation.isPending}
            onPress={() => mutation.mutate()}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
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

  pressed: { opacity: 0.85 },
});
