import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { ErrorCode } from '@/api/error-codes';
import { blocksApi, messagesApi, type Conversation, type Message } from '@/api/messages';
import { meApi } from '@/api/me';
import { uploadImage } from '@/api/uploads';
import { walletApi } from '@/api/wallet';
import { BlockDialog } from '@/components/messages/BlockDialog';
import { ConversationActionSheet } from '@/components/messages/ConversationActionSheet';
import { ConversationHeader } from '@/components/messages/ConversationHeader';
import { ImageMessageGroup } from '@/components/messages/ImageMessageGroup';
import { MessageBubble } from '@/components/messages/MessageBubble';
import { MessageComposer } from '@/components/messages/MessageComposer';
import { PhotoPickerSheet } from '@/components/messages/PhotoPickerSheet';
import { colors } from '@/theme';

function formatBudget(raw: string | undefined): string {
  if (!raw) return '';
  const num = Number(raw);
  if (!Number.isFinite(num)) return `₦${raw}`;
  // Backend returns Decimal as string with two trailing zeros; show whole NGN
  // for compactness in the header.
  return `₦${num.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function ConversationScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const conversationId: string = Array.isArray(rawId) ? (rawId[0] ?? '') : (rawId ?? '');

  const me = useQuery({
    queryKey: ['me'],
    queryFn: () => meApi.getMe(),
    refetchOnWindowFocus: false,
  });
  const myId = me.data?.id ?? '';

  const conversation = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => messagesApi.findOne(conversationId),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
  });

  const messages = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesApi.listMessages(conversationId, { limit: 50 }),
    enabled: !!conversationId,
    refetchInterval: 8_000,
  });

  const [composerValue, setComposerValue] = useState('');
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  const send = useMutation({
    mutationFn: (input: { body?: string; uploadIds?: string[] }) => messagesApi.send(conversationId, input),
    onSuccess: () => {
      setComposerValue('');
      void messages.refetch();
    },
    onError: (err) => {
      Alert.alert('Could not send', err instanceof Error ? err.message : 'Unknown error');
    },
  });

  const block = useMutation({
    mutationFn: (blockedId: string) => blocksApi.block(blockedId),
    onSuccess: () => {
      setBlockDialogOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
      void queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      void queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
    onError: (err) => {
      Alert.alert('Could not block', err instanceof Error ? err.message : 'Unknown error');
    },
  });

  const pay = useMutation({
    mutationFn: (postId: string) => walletApi.payForPost(postId),
    onSuccess: () => {
      // Refresh everything that shows payment state: the conversation header
      // flips to PAID, wallet balance drops, and /me posts update.
      void queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      void queryClient.invalidateQueries({ queryKey: ['conversations'] });
      void queryClient.invalidateQueries({ queryKey: ['wallet'] });
      void queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['posts', 'mine'] });
      Alert.alert('Payment successful', 'Your wallet has been charged and the post is now paid.');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.code === ErrorCode.WALLET_INSUFFICIENT_FUNDS) {
        Alert.alert('Not enough balance', 'Top up your wallet to cover this payment.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open wallet', onPress: () => router.push('/wallet') },
        ]);
        return;
      }
      const msg = err instanceof Error ? err.message : 'Could not complete payment. Try again.';
      Alert.alert('Payment failed', msg);
    },
  });

  const onMakePayment = useCallback((): void => {
    const post = conversation.data?.post;
    if (!post) return;
    if (post.status === 'PAID') {
      Alert.alert('Already paid', 'This post has already been paid for.');
      return;
    }
    const amount = formatBudget(post.budget);
    Alert.alert('Confirm payment', `Pay ${amount} from your wallet for ${post.category.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: `Pay ${amount}`, onPress: () => pay.mutate(post.id) },
    ]);
  }, [conversation.data?.post, pay]);

  const onPickPhotos = useCallback(
    async (assets: readonly { uri: string; mime: string | null }[], caption: string): Promise<void> => {
      try {
        const uploads = await Promise.all(assets.map((a) => uploadImage(a.uri, a.mime)));
        await messagesApi.send(conversationId, {
          uploadIds: uploads.map((u) => u.id),
          body: caption || undefined,
        });
        void messages.refetch();
      } catch (err) {
        Alert.alert('Upload failed', err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setPhotoSheetOpen(false);
      }
    },
    [conversationId, messages],
  );

  const counterparty: Conversation['shopper'] | undefined = useMemo(() => {
    if (!conversation.data || !myId) return undefined;
    return conversation.data.buyerId === myId ? conversation.data.shopper : conversation.data.buyer;
  }, [conversation.data, myId]);

  const orderedMessages = useMemo<Message[]>(() => {
    const list = messages.data ?? [];
    // Backend returns newest-first; for the chat we want oldest-first then
    // FlatList renders in inverted scroll for "stick to bottom" feel.
    return list.slice().reverse();
  }, [messages.data]);

  const isInteractive =
    conversation.data?.post.status !== 'CANCELLED' && conversation.data?.post.status !== 'PAID'
      ? true
      : conversation.data?.post.status === 'PAID';
  // Cancelled removes the composer entirely; Paid keeps it.
  const showComposer = conversation.data?.post.status !== 'CANCELLED';

  if (conversation.isLoading || !conversation.data || !counterparty) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </View>
    );
  }

  const conv = conversation.data;
  const counterpartyName = `${counterparty.firstName} ${counterparty.lastName}`.trim();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ConversationHeader
        name={counterpartyName || 'Conversation'}
        avatarUrl={counterparty.avatarUrl}
        postTitle={conv.post.category.name}
        budget={formatBudget(conv.post.budget)}
        status={conv.post.status}
        onMore={() => setActionSheetOpen(true)}
        onViewShop={() => Alert.alert('View Shopp', 'Shop view is out of scope for Page 3.')}
        onMakePayment={onMakePayment}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 12}
      >
        <View style={styles.chatArea}>
          <FlatList
            data={orderedMessages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.messagesContent}
            inverted={false}
            renderItem={({ item, index }) => {
              const fromMe = item.senderId === myId;
              const ts = formatTime(item.createdAt);
              const prev = index > 0 ? orderedMessages[index - 1] : undefined;
              const suppressSenderAvatar = !fromMe && prev?.senderId === item.senderId;

              if (item.type === 'IMAGE' && item.attachments.length > 0) {
                return (
                  <ImageMessageGroup
                    uris={item.attachments.map((a) => a.upload.url)}
                    fromMe={fromMe}
                    timestamp={ts}
                    read={!!item.readAt}
                    recipientAvatarUrl={fromMe ? counterparty.avatarUrl : null}
                    senderAvatarUrl={!fromMe ? counterparty.avatarUrl : null}
                    suppressSenderAvatar={suppressSenderAvatar}
                  />
                );
              }
              return (
                <MessageBubble
                  body={item.body ?? ''}
                  fromMe={fromMe}
                  timestamp={ts}
                  read={!!item.readAt}
                  recipientAvatarUrl={fromMe ? counterparty.avatarUrl : null}
                  senderAvatarUrl={!fromMe ? counterparty.avatarUrl : null}
                  suppressSenderAvatar={suppressSenderAvatar}
                />
              );
            }}
          />
        </View>

        {showComposer ? (
          <MessageComposer
            value={composerValue}
            onChange={setComposerValue}
            disabled={!isInteractive || send.isPending}
            onSend={() => {
              const text = composerValue.trim();
              if (!text) return;
              send.mutate({ body: text });
            }}
            onPickImage={() => setPhotoSheetOpen(true)}
            placeholder={`Message to ${counterparty.firstName}`}
          />
        ) : null}
      </KeyboardAvoidingView>

      <ConversationActionSheet
        visible={actionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        onBlock={() => setBlockDialogOpen(true)}
      />
      <BlockDialog
        visible={blockDialogOpen}
        pending={block.isPending}
        onClose={() => setBlockDialogOpen(false)}
        onConfirm={() => block.mutate(counterparty.id)}
      />
      <PhotoPickerSheet
        visible={photoSheetOpen}
        onClose={() => setPhotoSheetOpen(false)}
        onSubmit={(assets, caption) => {
          void onPickPhotos(assets, caption);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chatArea: { flex: 1, backgroundColor: '#F5F5F5' },
  messagesContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
});
