import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Address, addressesApi, formatAddressLine } from '@/api/addresses';
import { AddressFormSheet } from '@/components/AddressFormSheet';
import { Button } from '@/components/Button';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { NavigationArrowIcon } from '@/components/icons/NavigationArrowIcon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

export default function AddressesScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState<Address | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const {
    data: addresses = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.list,
  });

  const onAddNew = (): void => {
    setEditing(null);
    setSheetOpen(true);
  };

  const onEdit = (address: Address): void => {
    setEditing(address);
    setSheetOpen(true);
  };

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader />
        <Text style={styles.title}>My Addresses</Text>
        <Text style={styles.subtitle}>Manage the addresses we deliver your orders to.</Text>
      </View>

      {isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyBody}>Loading your addresses…</Text>
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No addresses yet</Text>
          <Text style={styles.emptyBody}>Add one now so you can check out faster next time.</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
          renderItem={({ item, index }) => (
            <AddressCard address={item} fallbackLabel={`Address ${index + 1}`} onPress={() => onEdit(item)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Add new address" onPress={onAddNew} />
      </View>

      <AddressFormSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} address={editing} />
    </Screen>
  );
}

interface CardProps {
  address: Address;
  fallbackLabel: string;
  onPress: () => void;
}

function AddressCard({ address, fallbackLabel, onPress }: CardProps): React.JSX.Element {
  const caption = address.label ?? (address.isDefault ? 'DEFAULT' : fallbackLabel.toUpperCase());
  const isHighlighted = address.isDefault;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.cardIcon, isHighlighted && styles.cardIconHighlight]}>
        {isHighlighted ? (
          <NavigationArrowIcon size={18} color={colors.brand.primary} />
        ) : (
          <LocationPinIcon size={18} color={colors.text.tertiary} />
        )}
      </View>
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardLine} numberOfLines={2}>
          {formatAddressLine(address)}
        </Text>
        <Text style={[styles.cardCaption, isHighlighted && styles.cardCaptionBrand]}>{caption}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: spacing.screenPadding },
  title: { ...typography.h1, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },

  listContent: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  separator: { height: spacing.sm },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.muted,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconHighlight: { backgroundColor: colors.brand.primaryTint },
  cardTextWrap: { flex: 1 },
  cardLine: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  cardCaption: {
    ...typography.eyebrow,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  cardCaptionBrand: { color: colors.brand.primary },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.h5, color: colors.text.primary },
  emptyBody: { ...typography.body, color: colors.text.secondary, textAlign: 'center' },

  footer: { paddingHorizontal: spacing.screenPadding, paddingTop: spacing.md },

  pressed: { opacity: 0.85 },
});
