import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { messagesApi, type Conversation } from '@/api/messages';
import { meApi } from '@/api/me';
import { BellIcon } from '@/components/icons/BellIcon';
import { ChatBubbleIcon } from '@/components/icons/ChatBubbleIcon';
import { MessagesListSkeleton } from '@/components/MessagesListSkeleton';
import { colors, fontFamilies, spacing, typography } from '@/theme';

const HEADER_HEIGHT = 56;

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMs = Date.now() - then;
  const mins = Math.max(0, Math.floor(diffMs / 60_000));
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

function previewLine(conv: Conversation, myId: string): string {
  const last = conv.lastMessage;
  if (!last) return 'No messages yet';
  const fromMe = last.senderId === myId;
  if (last.type === 'IMAGE' || !last.body) return fromMe ? 'Me: Photo' : 'Photo';
  const body = last.body.replace(/\s+/g, ' ').trim();
  return fromMe ? `Me: ${body}` : body;
}

interface RowProps {
  conv: Conversation;
  myId: string;
  onPress: () => void;
}

function ConversationRow({ conv, myId, onPress }: RowProps): React.JSX.Element {
  const counterparty = conv.buyerId === myId ? conv.shopper : conv.buyer;
  const name = `${conv.post.category.name}`;
  const preview = previewLine(conv, myId);
  const ts = relativeTime(conv.lastMessageAt);
  const unread = (conv.unreadCount ?? 0) > 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.avatarWrap}>
        {counterparty.avatarUrl ? (
          <Image
            source={{ uri: counterparty.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTopLine}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.rowMeta}>
            {unread ? <View style={styles.unreadDot} /> : null}
            <Text style={styles.rowTimestamp}>{ts}</Text>
          </View>
        </View>
        <Text style={styles.rowPreview} numberOfLines={2}>
          {preview}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState(): React.JSX.Element {
  return (
    <View style={styles.empty}>
      <ChatBubbleIcon size={28} color="#D7D7D7" />
      <Text style={styles.emptyText}>No messages yet</Text>
    </View>
  );
}

export default function MessagesScreen(): React.JSX.Element {
  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => meApi.getMe(),
    refetchOnWindowFocus: false,
  });
  const myId = me.data?.id ?? '';
  const conversations = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.list(),
    enabled: !!myId,
    refetchOnWindowFocus: false,
  });

  const data = conversations.data ?? [];
  const loading = conversations.isLoading || me.isLoading;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Notifications">
          <BellIcon size={22} color={colors.text.primary} />
        </Pressable>
      </View>
      <View style={styles.headerDivider} />

      {loading ? (
        <MessagesListSkeleton />
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ConversationRow
              conv={item}
              myId={myId}
              onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id } })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  header: {
    height: HEADER_HEIGHT,
    paddingHorizontal: spacing.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...typography.h2, color: colors.text.primary, fontSize: 22 },
  headerDivider: { height: 1, backgroundColor: colors.border.base },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.text.tertiary },

  listContent: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  separator: { height: 1, backgroundColor: colors.border.base, marginLeft: 76 },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    gap: 12,
  },
  rowPressed: { backgroundColor: colors.surface.muted },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { backgroundColor: colors.avatarFallback },
  rowBody: { flex: 1, minHeight: 44, justifyContent: 'center' },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowTitle: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 8 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.status.link },
  rowTimestamp: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.text.tertiary,
  },
  rowPreview: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 4,
    lineHeight: 18,
  },
});
