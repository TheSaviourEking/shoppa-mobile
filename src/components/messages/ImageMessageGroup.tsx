import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DoubleCheckIcon } from '@/components/icons/DoubleCheckIcon';
import { SingleCheckIcon } from '@/components/icons/SingleCheckIcon';
import { colors, fontFamilies } from '@/theme';

interface Props {
  uris: readonly string[];
  fromMe: boolean;
  timestamp?: string | null;
  read?: boolean;
  recipientAvatarUrl?: string | null;
  senderAvatarUrl?: string | null;
  suppressSenderAvatar?: boolean;
  onPressImage?: (uri: string, idx: number) => void;
}

const GROUP_W = 240;
const GAP = 4;

/** Layout uses up to 4 tiles in a 2x2 grid, matching the figma. */
function gridStyles(count: number): { row1: number; row2: number; cells: number } {
  if (count <= 1) return { row1: 1, row2: 0, cells: 1 };
  if (count === 2) return { row1: 2, row2: 0, cells: 2 };
  if (count === 3) return { row1: 2, row2: 1, cells: 3 };
  return { row1: 2, row2: 2, cells: 4 };
}

export function ImageMessageGroup({
  uris,
  fromMe,
  timestamp,
  read,
  recipientAvatarUrl,
  senderAvatarUrl,
  suppressSenderAvatar,
  onPressImage,
}: Props): React.JSX.Element {
  const layout = gridStyles(uris.length);
  const tileSide = layout.row1 === 1 ? GROUP_W : (GROUP_W - GAP) / 2;

  const renderTile = (uri: string, idx: number, w: number, h: number): React.JSX.Element => (
    <Pressable key={`${uri}-${idx}`} onPress={() => onPressImage?.(uri, idx)} style={{ width: w, height: h }}>
      <Image source={{ uri }} style={styles.tile} contentFit="cover" transition={120} />
    </Pressable>
  );

  return (
    <View style={[styles.col, fromMe ? styles.colMine : styles.colTheirs]}>
      <View style={[styles.group, { width: GROUP_W }]}>
        <View style={[styles.row, layout.row1 === 2 ? { gap: GAP } : null]}>
          {uris.slice(0, layout.row1).map((u, i) => renderTile(u, i, tileSide, tileSide))}
        </View>
        {layout.row2 > 0 ? (
          <View style={[styles.row, { gap: GAP, marginTop: GAP }]}>
            {uris
              .slice(layout.row1, layout.row1 + layout.row2)
              .map((u, i) => renderTile(u, layout.row1 + i, tileSide, tileSide))}
          </View>
        ) : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
  col: { marginVertical: 4 },
  colMine: { alignItems: 'flex-end' },
  colTheirs: { alignItems: 'flex-start' },
  group: { borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  tile: { flex: 1 },

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
