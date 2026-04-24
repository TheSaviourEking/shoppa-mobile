import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type PostStatus, type PostWithRelations, postsApi } from '@/api/posts';
import { Button } from '@/components/Button';
import { BagIcon } from '@/components/icons/BagIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

// Visual triplet per post status — mirrors the conversation-header palette:
// green = paid, grey = open/posted, red = cancelled.
const STATUS_STYLE: Record<PostStatus, { bg: string; fg: string; label: string }> = {
  POSTED: { bg: '#F5F5F5', fg: '#555555', label: 'Open' },
  PAID: { bg: 'rgba(0,204,44,0.12)', fg: colors.status.success, label: 'Paid' },
  CANCELLED: { bg: 'rgba(230,48,71,0.12)', fg: colors.status.error, label: 'Cancelled' },
};

function formatBudget(raw: string | undefined): string {
  if (!raw) return '';
  const num = Number(raw);
  if (!Number.isFinite(num)) return `₦${raw}`;
  return `₦${num.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export default function ShopScreen(): React.JSX.Element {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts', 'mine'],
    queryFn: postsApi.listMine,
  });

  const posts = useMemo<PostWithRelations[]>(() => data ?? [], [data]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <Text style={styles.subtitle}>Every shopping list you{"'"}ve posted so far.</Text>
      </View>

      {isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyBody}>Loading your requests…</Text>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyBody}>Post a request and shoppers will start sending offers.</Text>
          <View style={styles.emptyCta}>
            <Button label="Post a request" onPress={() => router.push('/post/category')} />
          </View>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
          renderItem={({ item }) => <PostRow post={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

function PostRow({ post }: { post: PostWithRelations }): React.JSX.Element {
  const status = STATUS_STYLE[post.status] ?? STATUS_STYLE.POSTED;
  const itemCount = post.items.length;
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${post.category.name}, ${status.label}, ${formatBudget(post.budget)}`}
    >
      <View style={styles.rowIcon}>
        <BagIcon size={20} color={colors.text.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {post.category.name}
        </Text>
        <Text style={styles.rowMeta}>
          {itemCount} item{itemCount === 1 ? '' : 's'} · {formatBudget(post.budget)}
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: status.bg }]}>
        <Text style={[styles.badgeLabel, { color: status.fg }]}>{status.label}</Text>
      </View>
      <ChevronRightIcon size={16} color={colors.text.tertiary} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  listContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl },
  separator: { height: spacing.sm },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.softer,
  },
  rowPressed: { opacity: 0.85 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowTitle: { fontFamily: fontFamilies.bodySemibold, fontSize: 16, color: colors.text.primary },
  rowMeta: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.h5, color: colors.text.primary },
  emptyBody: { ...typography.body, color: colors.text.secondary, textAlign: 'center' },
  emptyCta: { alignSelf: 'stretch', marginTop: spacing.lg },
});
