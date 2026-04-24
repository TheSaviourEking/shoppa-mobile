import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PostStatus } from '@/api/messages';
import { BagIcon } from '@/components/icons/BagIcon';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { MoreDotsIcon } from '@/components/icons/MoreDotsIcon';
import { XCircleIcon } from '@/components/icons/XCircleIcon';
import { colors, fontFamilies } from '@/theme';

interface Props {
  name: string;
  avatarUrl: string | null;
  postTitle: string;
  /** Already-formatted "₦500,000". */
  budget: string;
  status: PostStatus;
  onMore: () => void;
  onViewShop?: () => void;
  onMakePayment?: () => void;
}

export function ConversationHeader({
  name,
  avatarUrl,
  postTitle,
  budget,
  status,
  onMore,
  onViewShop,
  onMakePayment,
}: Props): React.JSX.Element {
  const isCancelled = status === 'CANCELLED';
  const isPaid = status === 'PAID';

  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconBtn}
        >
          <ChevronLeftIcon size={18} color={colors.text.primary} />
        </Pressable>

        <View style={styles.identity}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]} />
          )}
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </View>

        <Pressable
          onPress={onMore}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="More options"
          style={styles.iconBtn}
        >
          <MoreDotsIcon size={20} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.postRow}>
        <BagIcon size={16} color={colors.text.tertiary} />
        <Text style={styles.postTitle} numberOfLines={1}>
          {postTitle}
        </Text>
        <View style={styles.statusRight}>
          {isCancelled ? (
            <View style={styles.statusBadge}>
              <XCircleIcon size={16} color={colors.status.error} />
              <Text style={[styles.statusText, { color: colors.status.error }]}>Canceled</Text>
            </View>
          ) : isPaid ? (
            <View style={styles.statusBadge}>
              <CheckCircleIcon size={16} color={colors.status.success} />
              <Text style={styles.budgetText}>{budget}</Text>
            </View>
          ) : (
            <Text style={styles.budgetText}>{budget}</Text>
          )}
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={onViewShop}
          style={({ pressed }) => [
            styles.pillBtn,
            isCancelled || isPaid ? styles.pillBtnFull : styles.pillBtnHalf,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.pillLabel}>View Shopp</Text>
        </Pressable>
        {!isCancelled && !isPaid ? (
          <Pressable
            onPress={onMakePayment}
            style={({ pressed }) => [styles.pillBtn, styles.pillBtnHalf, pressed && styles.pressed]}
          >
            <Text style={styles.pillLabel}>Make Payment</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.surface.base, paddingHorizontal: 20, paddingBottom: 12 },

  topRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarFallback: { backgroundColor: colors.avatarFallback },
  name: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
  },

  postRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  postTitle: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontFamily: fontFamilies.bodySemibold, fontSize: 14 },
  budgetText: { fontFamily: fontFamilies.bodySemibold, fontSize: 14, color: '#333333' },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  pillBtn: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnHalf: { flex: 1 },
  pillBtnFull: { flex: 1 },
  pillLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: colors.brand.primary,
  },
  pressed: { opacity: 0.85 },
});
