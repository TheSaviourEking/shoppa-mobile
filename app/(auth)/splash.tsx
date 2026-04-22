import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShoppaLogo } from '@/components/icons/ShoppaLogo';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/theme';

const SPLASH_DURATION_MS = 1600;

export default function SplashScreen(): React.JSX.Element {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/onboarding'), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Screen background={colors.brand.primary} padded={false}>
      <View style={styles.center}>
        <View style={styles.column}>
          <ShoppaLogo size={36} color={colors.text.onBrand} />
          <Text style={styles.brand}>Shoppa</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  column: { alignItems: 'center', gap: spacing.sm },
  brand: { ...typography.h1, color: colors.text.onBrand, textAlign: 'center' },
});
