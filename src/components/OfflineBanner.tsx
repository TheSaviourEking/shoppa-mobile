import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies } from '@/theme';

/**
 * Small banner pinned to the bottom of the viewport that slides in while
 * the device reports no internet. Intentionally ambient — it sits below
 * the app content without blocking any controls, so the user can still
 * tap around (queries will fail, but that's the honest signal).
 *
 * Debounced: we require `isConnected === false` for 600ms before showing.
 * Cellular handoffs and Wi-Fi re-authentications can flap `false` for a
 * single tick and the banner would otherwise flash.
 */
export function OfflineBanner(): React.JSX.Element | null {
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let flapTimer: ReturnType<typeof setTimeout> | null = null;
    const sub = NetInfo.addEventListener((state) => {
      // `isInternetReachable` is sometimes null on the first tick — treat
      // that as "unknown, assume connected" to avoid a false positive at
      // boot. Only `false` (confirmed unreachable) flips the banner on.
      const isOnline = state.isConnected !== false && state.isInternetReachable !== false;
      if (flapTimer) clearTimeout(flapTimer);
      if (isOnline) {
        setOffline(false);
      } else {
        flapTimer = setTimeout(() => setOffline(true), 600);
      }
    });
    return () => {
      if (flapTimer) clearTimeout(flapTimer);
      sub();
    };
  }, []);

  if (!offline) return null;

  return (
    <Animated.View
      entering={SlideInDown.duration(240)}
      exiting={SlideOutDown.duration(180)}
      style={[styles.banner, { paddingBottom: insets.bottom + 10 }]}
      pointerEvents="none"
    >
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    alignItems: 'center',
    backgroundColor: colors.text.primary,
  },
  text: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 13,
    color: colors.surface.base,
  },
});
