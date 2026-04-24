import { StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonList } from './Skeleton';
import { colors, spacing } from '@/theme';

/**
 * Matches the shop "My Requests" row: rounded card with category icon,
 * title + budget, status pill, trailing chevron. Rendered in the shop
 * screen's loading branch.
 */
export function ShopHistorySkeleton({ rows = 5 }: { rows?: number }): React.JSX.Element {
  return (
    <View style={styles.root}>
      <SkeletonList
        count={rows}
        separator={12}
        renderItem={() => (
          <View style={styles.card}>
            <Skeleton width={40} height={40} borderRadius={12} />
            <View style={styles.body}>
              <Skeleton width={`70%` as const} height={14} borderRadius={3} />
              <Skeleton width={90} height={12} borderRadius={3} style={styles.budget} />
            </View>
            <Skeleton width={56} height={22} borderRadius={11} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface.base,
    borderWidth: 1,
    borderColor: colors.border.base,
  },
  body: { flex: 1 },
  budget: { marginTop: 6 },
});
