import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { CloudBlobsBackground } from '@/components/decor/CloudBlobsBackground';
import { ShoppaLogo } from '@/components/icons/ShoppaLogo';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const onContinue = (): void => {
    router.replace('/(tabs)');
  };

  return (
    <Screen background={colors.brand.primary} padded={false}>
      <CloudBlobsBackground />

      <View style={styles.center}>
        <View style={styles.logoBlock}>
          <ShoppaLogo size={36} color={colors.text.onBrand} />
        </View>
        <Text style={styles.title}>Welcome to Shoppa</Text>
        <Text style={styles.subtitle}>Clear your shopping list quick and easy.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button variant="secondary" label="Continue to Home" onPress={onContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  logoBlock: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { ...typography.h1, color: colors.text.onBrand, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.brand.onPurpleMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  footer: { paddingHorizontal: spacing.screenPadding },
});
