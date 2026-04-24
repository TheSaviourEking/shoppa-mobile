import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DoubleCheckIcon } from '@/components/icons/DoubleCheckIcon';
import { SingleCheckIcon } from '@/components/icons/SingleCheckIcon';
import { colors, fontFamilies } from '@/theme';

// Mount-only entrance: slide up 12px while fading in over 220ms, ease out
// with a small spring tail. Fires once per bubble — polled-in new messages
// animate individually, existing messages on first list render animate
// simultaneously (FlatList mounts them in one tick).
const BUBBLE_ENTER = FadeInDown.duration(220).springify().damping(22);

interface Props {
  body: string;
  /** True when the bubble is from the local user (right-aligned, blue). */
  fromMe: boolean;
  /** "h:mm AM" timestamp. Pass null/undefined to hide the meta row. */
  timestamp?: string | null;
  /** Read-receipt state. Only meaningful for fromMe bubbles. */
  read?: boolean;
  /** Avatar URL of the recipient — shown next to mine bubbles' meta line. */
  recipientAvatarUrl?: string | null;
  /** Avatar URL of the sender — shown beside the bubble for theirs. */
  senderAvatarUrl?: string | null;
  /** When true, suppress the small avatar next to a "theirs" bubble (used
   *  to avoid stacking duplicate avatars in same-sender runs). */
  suppressSenderAvatar?: boolean;
}

export function MessageBubble({
  body,
  fromMe,
  timestamp,
  read,
  recipientAvatarUrl,
  senderAvatarUrl,
  suppressSenderAvatar,
}: Props): React.JSX.Element {
  return (
    <Animated.View entering={BUBBLE_ENTER} style={[styles.col, fromMe ? styles.colMine : styles.colTheirs]}>
      <View style={[styles.bubble, fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.text, fromMe ? styles.textMine : styles.textTheirs]}>{body}</Text>
      </View>
      {fromMe ? (
        <View style={styles.metaRowMine}>
          {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
          {read ? (
            <DoubleCheckIcon size={14} color={colors.brand.primary} />
          ) : (
            <SingleCheckIcon size={14} color={colors.text.tertiary} />
          )}
          {recipientAvatarUrl ? (
            <Image source={{ uri: recipientAvatarUrl }} style={styles.metaAvatar} contentFit="cover" />
          ) : (
            <View style={[styles.metaAvatar, styles.avatarFallback]} />
          )}
        </View>
      ) : !suppressSenderAvatar ? (
        senderAvatarUrl ? (
          <Image source={{ uri: senderAvatarUrl }} style={styles.theirsAvatar} contentFit="cover" />
        ) : (
          <View style={[styles.theirsAvatar, styles.avatarFallback]} />
        )
      ) : null}
    </Animated.View>
  );
}

const BUBBLE_MAX_W = '78%';

const styles = StyleSheet.create({
  col: { marginVertical: 4, maxWidth: '100%' },
  colMine: { alignItems: 'flex-end' },
  colTheirs: { alignItems: 'flex-start' },

  bubble: {
    maxWidth: BUBBLE_MAX_W,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleMine: {
    backgroundColor: '#63ACFB',
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  text: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20 },
  textMine: { color: '#FFFFFF' },
  textTheirs: { color: '#3C3C3C' },

  metaRowMine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingRight: 2,
  },
  timestamp: { fontFamily: fontFamilies.body, fontSize: 11, color: '#A3A3A3' },
  metaAvatar: { width: 16, height: 16, borderRadius: 8, marginLeft: 2 },

  theirsAvatar: { width: 22, height: 22, borderRadius: 11, marginTop: 4, marginLeft: 4 },

  avatarFallback: { backgroundColor: colors.avatarFallback },
});
