import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Category } from '@/api/posts';
import { Button } from '@/components/Button';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { colors, radii, spacing, typography } from '@/theme';

interface Props {
  visible: boolean;
  categories: Category[];
  selectedId: string | null;
  onClose: () => void;
  onSelect: (category: Category) => void;
}

export function CategorySelectSheet({
  visible,
  categories,
  selectedId,
  onClose,
  onSelect,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(selectedId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const onDone = (): void => {
    const picked = categories.find((c) => c.id === pendingId);
    if (picked) onSelect(picked);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Select a Category</Text>
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

        <View style={styles.search}>
          <SearchIcon size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        <Text style={styles.sectionLabel}>
          {query ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'Popular Categories'}
        </Text>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          data={filtered}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item: c }) => {
            const picked = c.id === pendingId;
            return (
              <Pressable
                onPress={() => setPendingId(c.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: picked }}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <Text style={styles.rowLabel}>{c.name}</Text>
                <View style={[styles.radio, picked && styles.radioChecked]}>
                  {picked ? <CheckIcon size={12} color={colors.text.onBrand} /> : null}
                </View>
              </Pressable>
            );
          }}
        />

        <Button label="Done" disabled={!pendingId} onPress={onDone} />
      </View>
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
    maxHeight: '85%',
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
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

  search: {
    marginTop: spacing.md,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.muted,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    padding: 0,
  },

  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },

  list: { flexGrow: 0, marginTop: spacing.sm },
  listContent: { paddingBottom: spacing.md },

  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: { ...typography.bodyLarge, color: colors.text.primary },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioChecked: {
    backgroundColor: colors.status.success,
    borderColor: colors.status.success,
  },

  pressed: { opacity: 0.7 },
});
