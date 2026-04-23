import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Category, postsApi } from '@/api/posts';
import { Button } from '@/components/Button';
import { CategorySelectSheet } from '@/components/CategorySelectSheet';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, spacing, typography } from '@/theme';

export default function CategoryScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = usePostFlow();
  const [selected, setSelected] = useState<Category | null>(
    flow.categoryId && flow.categoryName
      ? ({ id: flow.categoryId, name: flow.categoryName } as Category)
      : null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: postsApi.listCategories,
  });

  const onContinue = (): void => {
    if (!selected) return;
    flow.setCategory(selected.id, selected.name);
    router.push('/post/items');
  };

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader step={1} totalSteps={6} progressVariant="line" />

        <Text style={styles.title}>Start with a category</Text>
        <Text style={styles.subtitle}>What category is your shopping list.</Text>

        <Text style={styles.label}>Category</Text>
        <Pressable
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [styles.select, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Select category"
        >
          <Text style={selected ? styles.selectValue : styles.selectPlaceholder}>
            {selected ? selected.name : 'select your category'}
          </Text>
          <ChevronDownIcon size={20} color={colors.text.tertiary} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Continue" disabled={!selected} onPress={onContinue} />
      </View>

      <CategorySelectSheet
        visible={sheetOpen}
        categories={categories}
        selectedId={selected?.id ?? null}
        onClose={() => setSheetOpen(false)}
        onSelect={setSelected}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  label: {
    ...typography.bodySemibold,
    color: colors.text.primary,
    marginTop: spacing.xl,
  },
  select: {
    marginTop: spacing.sm,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.muted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectPlaceholder: { ...typography.body, color: colors.text.tertiary },
  selectValue: { ...typography.body, color: colors.text.primary },

  pressed: { opacity: 0.85 },

  footer: { paddingHorizontal: spacing.screenPadding },
});
