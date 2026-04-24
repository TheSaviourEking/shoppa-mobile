import { StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonList } from './Skeleton';
import { colors, spacing } from '@/theme';

/**
 * Placeholder rows that match the real ConversationRow's geometry 1:1
 * (44×44 avatar, 14pt title line, 13pt preview line, 12pt timestamp).
 * Keeps the content area from jumping when the real data lands.
 */
export function MessagesListSkeleton({ rows = 6 }: { rows?: number }): React.JSX.Element {
  return (
    <View style={styles.root}>
      <SkeletonList
        count={rows}
        renderItem={() => (
          <View style={styles.row}>
            <Skeleton width={44} height={44} borderRadius={22} />
            <View style={styles.body}>
              <View style={styles.topLine}>
                <Skeleton width={`60%` as const} height={14} borderRadius={4} />
                <Skeleton width={28} height={12} borderRadius={3} />
              </View>
              <Skeleton width={`90%` as const} height={13} borderRadius={3} style={styles.previewFirst} />
              <Skeleton width={`75%` as const} height={13} borderRadius={3} style={styles.previewSecond} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    gap: 12,
    borderBottomColor: colors.border.base,
    borderBottomWidth: 1,
    marginLeft: 0,
  },
  body: { flex: 1, minHeight: 44, justifyContent: 'center' },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewFirst: { marginTop: 8 },
  previewSecond: { marginTop: 5 },
});
