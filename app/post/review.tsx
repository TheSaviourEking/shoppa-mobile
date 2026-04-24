import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { type CreatePostItem, postsApi } from '@/api/posts';
import { uploadImage } from '@/api/uploads';
import { Button } from '@/components/Button';
import { BagIcon } from '@/components/icons/BagIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { NoteIcon } from '@/components/icons/NoteIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { usePostFlow } from '@/store/postFlow';
import { colors, fontFamilies, spacing, typography } from '@/theme';

function formatNaira(digits: string): string {
  if (!digits) return '₦0';
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₦${withCommas}`;
}

export default function ReviewScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const flow = usePostFlow();

  const canPost = !!flow.categoryId && !!flow.deliveryAddress && flow.items.length > 0 && !!flow.budget;

  const post = useMutation({
    mutationFn: async () => {
      if (!flow.categoryId || !flow.deliveryAddress) {
        throw new Error('Missing category or delivery address');
      }
      // Upload any item images first so their object keys can ride on the
      // post create — one network round-trip per image, sequentially so the
      // user sees a clean pending state and the backend stays well-behaved.
      const items: CreatePostItem[] = [];
      for (const item of flow.items) {
        if (item.imageUri) {
          const uploaded = await uploadImage(item.imageUri, item.imageMime);
          items.push({ name: item.name, imageKey: uploaded.key });
        } else {
          items.push({ name: item.name });
        }
      }
      return postsApi.create({
        categoryId: flow.categoryId,
        deliveryAddressId: flow.deliveryAddress.id,
        items,
        note: flow.note || undefined,
        budget: Number(flow.budget),
        installmentsCount: flow.instalments,
      });
    },
    onSuccess: () => {
      router.replace('/post/success');
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not post your list. Try again.';
      Alert.alert('Post failed', msg);
    },
  });

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader step={6} totalSteps={6} progressVariant="line" />

        <Text style={styles.title}>Ready to get offers?</Text>
        <Text style={styles.subtitle}>Post your shopping list.</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Row
            icon={<BagIcon size={20} color={colors.text.primary} />}
            label={flow.categoryName ?? 'Category not selected'}
            trailing={<ChevronRightIcon size={16} color={colors.text.tertiary} strokeWidth={2} />}
          />

          <View style={styles.itemsHeader}>
            <Text style={styles.itemsHeaderLabel}>Items</Text>
            <ChevronRightIcon size={16} color={colors.text.tertiary} strokeWidth={2} />
          </View>
          {flow.items.map((item) => (
            <View key={item.clientId} style={styles.itemRow}>
              <View style={styles.itemThumb}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.itemThumbImage} />
                ) : null}
              </View>
              <Text style={styles.itemLabel}>{item.name}</Text>
            </View>
          ))}

          {flow.note ? (
            <Row
              icon={<NoteIcon size={20} color={colors.text.primary} strokeWidth={1.8} />}
              label={flow.note}
              multiline
            />
          ) : null}

          <Row icon={<Text style={styles.nairaGlyph}>₦</Text>} label={formatNaira(flow.budget)} />

          <Row
            icon={<LocationPinIcon size={20} color={colors.text.primary} strokeWidth={1.8} />}
            label={flow.deliveryAddress?.line ?? 'No address'}
            multiline
          />
        </ScrollView>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label={post.isPending ? 'Posting…' : 'Post'}
          disabled={!canPost || post.isPending}
          loading={post.isPending}
          onPress={() => post.mutate()}
        />
        {post.isPending ? <ActivityIndicator style={styles.loader} /> : null}
      </View>
    </Screen>
  );
}

function Row({
  icon,
  label,
  trailing,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  multiline?: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowLabel} numberOfLines={multiline ? undefined : 1}>
        {label}
      </Text>
      {trailing ?? <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { flex: 1, paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  scroll: { flex: 1, marginTop: spacing.lg },
  scrollContent: { gap: spacing.md, paddingBottom: spacing.xl },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.text.primary,
  },
  nairaGlyph: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 18,
    color: colors.text.primary,
  },

  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  itemsHeaderLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface.muted,
    overflow: 'hidden',
  },
  itemThumbImage: { width: '100%', height: '100%' },
  itemLabel: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.text.primary,
  },

  footer: { paddingHorizontal: spacing.screenPadding },
  loader: { marginTop: spacing.sm },
});
