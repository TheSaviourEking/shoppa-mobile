import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies } from '@/theme';

/**
 * Purple top bar used on the post-home screen. Figma:
 * 390×98 fill #905FF8, 1px bottom border #986BF9, "Shoppa" wordmark
 * anchored bottom-left at x=20. The 98 total height collapses the iOS
 * status bar area (safe-area top inset) + a 48px content row.
 */
const CONTENT_HEIGHT = 48;

export function HomeTopBar(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top, height: insets.top + CONTENT_HEIGHT }]}>
      <View style={styles.row}>
        <Text style={styles.wordmark}>Shoppa</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.brand.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#986BF9',
  },
  row: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: fontFamilies.display,
    fontSize: 18,
    lineHeight: 22,
    color: colors.text.onBrand,
  },
});
