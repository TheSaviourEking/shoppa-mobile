import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface PickedImage {
  uri: string;
  mime: string | null;
}

interface Options {
  /** Whether to open the system's crop/edit step after capture/selection. */
  allowsEditing?: boolean;
  /** Aspect ratio for the crop step. `[1, 1]` for avatars, `undefined` for free-form. */
  aspect?: [number, number];
  /** 0–1, forwarded to both camera and library. Lower = smaller upload. */
  quality?: number;
}

async function fromCamera(opts: Options): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Camera permission needed', 'Allow camera access in Settings to snap a photo.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: opts.allowsEditing ?? true,
    aspect: opts.aspect,
    quality: opts.quality ?? 0.8,
  });
  if (res.canceled || !res.assets[0]) return null;
  return { uri: res.assets[0].uri, mime: res.assets[0].mimeType ?? null };
}

async function fromLibrary(opts: Options): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', 'Allow photo library access to pick a photo.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: opts.allowsEditing ?? true,
    aspect: opts.aspect,
    quality: opts.quality ?? 0.8,
  });
  if (res.canceled || !res.assets[0]) return null;
  return { uri: res.assets[0].uri, mime: res.assets[0].mimeType ?? null };
}

/**
 * Show a native three-button prompt (Take photo / Choose from library / Cancel),
 * request the right permission once the user picks, and return the chosen
 * asset. Returns `null` if the user cancels or permission is denied.
 *
 * Wrapping `Alert.alert` in a Promise is the simplest way to await the user's
 * choice without pulling in an ActionSheetIOS / Android-manual split.
 */
export async function pickImage(opts: Options = {}): Promise<PickedImage | null> {
  const source = await new Promise<'camera' | 'library' | null>((resolve) => {
    Alert.alert(
      'Add photo',
      undefined,
      [
        { text: 'Take photo', onPress: () => resolve('camera') },
        { text: 'Choose from library', onPress: () => resolve('library') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ],
      // On Android the user can tap outside the alert — treat that as cancel.
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });

  if (source === 'camera') return fromCamera(opts);
  if (source === 'library') return fromLibrary(opts);
  return null;
}
