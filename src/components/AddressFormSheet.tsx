import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Address, addressesApi } from '@/api/addresses';
import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { Input } from '@/components/Input';
import { colors, spacing, typography } from '@/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Existing address to edit, or null to create a new one. */
  address: Address | null;
  onSaved?: (address: Address) => void;
}

interface FormState {
  label: string;
  line: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const emptyForm = (): FormState => ({
  label: '',
  line: '',
  city: '',
  state: '',
  country: 'Nigeria',
  isDefault: false,
});

const hydrate = (address: Address | null): FormState =>
  address
    ? {
        label: address.label ?? '',
        line: address.line,
        city: address.city,
        state: address.state,
        country: address.country,
        isDefault: address.isDefault,
      }
    : emptyForm();

export function AddressFormSheet({ visible, onClose, address, onSaved }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const isEdit = !!address;
  const [form, setForm] = useState<FormState>(() => hydrate(address));

  useEffect(() => {
    if (visible) setForm(hydrate(address));
  }, [visible, address]);

  const save = useMutation({
    mutationFn: async (): Promise<Address> => {
      const payload = {
        label: form.label.trim() || undefined,
        line: form.line.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        isDefault: form.isDefault,
      };
      return isEdit ? addressesApi.update(address.id, payload) : addressesApi.create(payload);
    },
    onSuccess: async (saved) => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onSaved?.(saved);
      onClose();
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not save the address.';
      Alert.alert(isEdit ? 'Update failed' : 'Save failed', msg);
    },
  });

  const remove = useMutation({
    mutationFn: () => {
      if (!address) throw new Error('cannot delete a new address');
      return addressesApi.remove(address.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onClose();
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not delete the address.';
      Alert.alert('Delete failed', msg);
    },
  });

  const confirmDelete = (): void => {
    Alert.alert('Delete address?', 'This address will be removed from your saved list.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove.mutate() },
    ]);
  };

  const canSave =
    form.line.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0 &&
    form.country.trim().length > 0 &&
    !save.isPending &&
    !remove.isPending;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView style={styles.sheetWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEdit ? 'Edit address' : 'Add new address'}</Text>
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

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            <Input
              label="Label (optional)"
              hint="e.g. Home, Office"
              value={form.label}
              onChangeText={(v) => setForm((s) => ({ ...s, label: v }))}
              placeholder="Home"
              autoCapitalize="words"
            />

            <View style={styles.field}>
              <Input
                label="Street address"
                value={form.line}
                onChangeText={(v) => setForm((s) => ({ ...s, line: v }))}
                placeholder="53, Bamidele Eletu Ave"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Input
                label="City"
                value={form.city}
                onChangeText={(v) => setForm((s) => ({ ...s, city: v }))}
                placeholder="Lagos"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Input
                label="State"
                value={form.state}
                onChangeText={(v) => setForm((s) => ({ ...s, state: v }))}
                placeholder="Lagos"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Input
                label="Country"
                value={form.country}
                onChangeText={(v) => setForm((s) => ({ ...s, country: v }))}
                placeholder="Nigeria"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Set as default</Text>
              <Switch
                value={form.isDefault}
                onValueChange={(v) => setForm((s) => ({ ...s, isDefault: v }))}
                trackColor={{ false: colors.border.base, true: colors.brand.primary }}
                thumbColor={colors.surface.base}
                ios_backgroundColor={colors.border.base}
              />
            </View>
          </ScrollView>

          <Button
            label={isEdit ? 'Save changes' : 'Add address'}
            disabled={!canSave}
            loading={save.isPending}
            onPress={() => save.mutate()}
          />

          {isEdit ? (
            <Pressable
              onPress={confirmDelete}
              disabled={remove.isPending}
              accessibilityRole="button"
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Text style={styles.deleteLabel}>{remove.isPending ? 'Deleting…' : 'Delete address'}</Text>
            </Pressable>
          ) : null}
        </View>
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
    maxHeight: '92%',
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

  formContent: { gap: spacing.sm, paddingBottom: spacing.md },
  field: { marginTop: spacing.xs },

  toggleRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: { ...typography.bodyLarge, color: colors.text.primary },

  deleteBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  deleteLabel: { ...typography.bodyMediumSemibold, color: colors.status.error },

  pressed: { opacity: 0.85 },
});
