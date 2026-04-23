import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ItemAddSheet } from '@/components/ItemAddSheet';
import { TabPostIcon } from '@/components/icons/TabPostIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

export default function ItemsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const items = usePostFlow((s) => s.items);
  const addItem = usePostFlow((s) => s.addItem);
  const [sheetOpen, setSheetOpen] = useState(false);

  const onContinue = (): void => {
    if (items.length === 0) return;
    router.push('/post/note');
  };

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader step={2} totalSteps={6} progressVariant="line" />

        <Text style={styles.title}>Add items</Text>
        <Text style={styles.subtitle}>Add items to your list.</Text>

        <Pressable
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Add new item"
        >
          <View style={styles.addIcon}>
            <TabPostIcon size={24} color={colors.brand.primary} />
          </View>
          <Text style={styles.addLabel}>Add new item</Text>
        </Pressable>

        {items.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Items</Text>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <View key={item.clientId} style={styles.row}>
                  <View style={styles.thumb}>
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.thumbImage} />
                    ) : null}
                  </View>
                  <Text style={styles.rowLabel}>{item.name}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Continue" disabled={items.length === 0} onPress={onContinue} />
      </View>

      <ItemAddSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onAdd={(item) => addItem(item)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  addBtn: {
    marginTop: spacing.xl,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border.base,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: colors.text.primary,
  },

  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },

  list: { flexGrow: 0, marginTop: spacing.sm },
  listContent: { paddingBottom: spacing.md, gap: spacing.md },

  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface.muted,
    overflow: 'hidden',
  },
  thumbImage: { width: '100%', height: '100%' },
  rowLabel: { ...typography.bodyLarge, color: colors.text.primary },

  pressed: { opacity: 0.85 },

  footer: { paddingHorizontal: spacing.screenPadding },
});
