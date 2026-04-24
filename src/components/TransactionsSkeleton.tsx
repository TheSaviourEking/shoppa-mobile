import { StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonList } from './Skeleton';
import { spacing } from '@/theme';

/**
 * Matches the wallet transaction row — 40×40 icon on the left, title line
 * + date below, amount on the right. Rendered inside the wallet screen's
 * SectionList loading branch.
 */
export function TransactionsSkeleton({ rows = 6 }: { rows?: number }): React.JSX.Element {
  return (
    <View style={styles.root}>
      <Skeleton width={120} height={14} borderRadius={3} style={styles.monthHeader} />
      <SkeletonList
        count={rows}
        renderItem={() => (
          <View style={styles.row}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.body}>
              <Skeleton width={`70%` as const} height={14} borderRadius={3} />
              <Skeleton width={`50%` as const} height={12} borderRadius={3} style={styles.date} />
            </View>
            <Skeleton width={82} height={16} borderRadius={3} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: spacing.screenPadding },
  monthHeader: { marginTop: spacing.lg, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 12,
  },
  body: { flex: 1 },
  date: { marginTop: 6 },
});
