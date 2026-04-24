import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { fontFamilies } from '@/theme';

const MAX_SELECTION = 4;

interface PickedAsset {
  uri: string;
  mime: string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (assets: readonly PickedAsset[], caption: string) => void;
}

export function PhotoPickerSheet({ visible, onClose, onSubmit }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [library, setLibrary] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (!visible) {
      setSelected([]);
      setCaption('');
      return;
    }
    let cancelled = false;
    void (async (): Promise<void> => {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission needed', 'Allow photo library access to attach photos.');
        onClose();
        return;
      }
      // Open the system multi-pick UI as the data source. Our sheet wraps it
      // for the caption + max-4 enforcement on top of whatever it returns.
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: MAX_SELECTION,
        quality: 0.85,
      });
      if (cancelled) return;
      if (res.canceled || res.assets.length === 0) {
        onClose();
        return;
      }
      setLibrary(res.assets);
      setSelected(res.assets.map((a) => a.uri));
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, onClose]);

  const toggle = (uri: string): void => {
    setSelected((prev) => {
      if (prev.includes(uri)) return prev.filter((u) => u !== uri);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, uri];
    });
  };

  const submit = (): void => {
    const picked = library
      .filter((a) => selected.includes(a.uri))
      .map<PickedAsset>((a) => ({ uri: a.uri, mime: a.mimeType ?? null }));
    if (picked.length === 0) return;
    onSubmit(picked, caption.trim());
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="slide" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.header}>
          <Pressable hitSlop={8} onPress={onClose} accessibilityRole="button">
            <Text style={[styles.headerLabel, styles.cancel]}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Select up to {MAX_SELECTION} items.</Text>
          <Pressable hitSlop={8} onPress={submit} disabled={selected.length === 0} accessibilityRole="button">
            <Text style={[styles.headerLabel, styles.upload, selected.length === 0 && styles.uploadDisabled]}>
              Upload
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={library}
          keyExtractor={(item) => item.uri}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.uri);
            return (
              <Pressable style={styles.tile} onPress={() => toggle(item.uri)}>
                <Image source={{ uri: item.uri }} style={styles.tileImage} />
                {isSelected ? (
                  <View style={styles.checkBadge}>
                    <CheckIcon size={14} color="#FFFFFF" />
                  </View>
                ) : null}
              </Pressable>
            );
          }}
        />

        {selected.length > 0 ? (
          <View style={styles.captionRow}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add caption"
              placeholderTextColor="#A3A3A3"
              value={caption}
              onChangeText={setCaption}
            />
            <Pressable
              accessibilityRole="button"
              onPress={submit}
              style={({ pressed }) => [styles.sendBtn, pressed && styles.pressed]}
            >
              <Text style={styles.sendLabel}>Send</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,1,32,0.4)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '8%',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontFamily: fontFamilies.bodySemibold, fontSize: 12, color: '#1A1A1A' },
  headerLabel: { fontFamily: fontFamilies.bodySemibold, fontSize: 16 },
  cancel: { color: '#0A84FF' },
  upload: { color: '#0A84FF' },
  uploadDisabled: { opacity: 0.4 },

  gridContent: { paddingHorizontal: 2, paddingBottom: 8 },
  tile: { flex: 1 / 3, aspectRatio: 1, padding: 1 },
  tileImage: { flex: 1 },
  checkBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  captionInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F5',
    fontFamily: fontFamilies.body,
    fontSize: 14,
    color: '#1A1A1A',
  },
  sendBtn: {
    paddingHorizontal: 22,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#905FF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: { fontFamily: fontFamilies.bodySemibold, fontSize: 14, color: '#FFFFFF' },
  pressed: { opacity: 0.85 },
});
