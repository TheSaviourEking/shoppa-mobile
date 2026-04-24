import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type Address, addressesApi, formatAddressLine } from '@/api/addresses';
import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { LocationPinIcon } from '@/components/icons/LocationPinIcon';
import { NavigationArrowIcon } from '@/components/icons/NavigationArrowIcon';
import { SearchIcon } from '@/components/icons/SearchIcon';
import { colors, fontFamilies, radii, spacing, typography } from '@/theme';

type SheetMode = 'pick' | 'add';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

export function DeliverySheet({ visible, onClose, onSelect }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<SheetMode>('pick');

  // Single query subscription shared between pick and add views — the earlier
  // two-query version re-subscribed on every mode switch, which surfaced as
  // the sheet flickering mid-typing.
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.list,
    enabled: visible,
  });

  useEffect(() => {
    if (!visible) setMode('pick');
  }, [visible]);

  const switchToAdd = useCallback(() => setMode('add'), []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView style={styles.sheetWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          {mode === 'pick' ? (
            <PickAddressView
              addresses={addresses}
              loading={isLoading}
              onClose={onClose}
              onAddNew={switchToAdd}
              onSelect={onSelect}
            />
          ) : (
            <AddAddressView addresses={addresses} onClose={onClose} onSelect={onSelect} />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface PickProps {
  addresses: Address[];
  loading: boolean;
  onClose: () => void;
  onAddNew: () => void;
  onSelect: (address: Address) => void;
}

const PickAddressView = memo(function PickAddressView({
  addresses,
  loading,
  onClose,
  onAddNew,
  onSelect,
}: PickProps): React.JSX.Element {
  const [firstSaved, ...rest] = addresses;

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery address</Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
        >
          <CloseIcon size={16} color={colors.text.primary} />
        </Pressable>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        data={rest}
        keyExtractor={(a) => a.id}
        ListHeaderComponent={
          <>
            {loading ? <ActivityIndicator color={colors.brand.primary} style={styles.loader} /> : null}
            {firstSaved ? (
              <Pressable
                onPress={() => onSelect(firstSaved)}
                style={({ pressed }) => [styles.card, styles.headerCard, pressed && styles.pressed]}
                accessibilityRole="button"
              >
                <View style={[styles.cardIcon, styles.cardIconHighlight]}>
                  <NavigationArrowIcon size={18} color={colors.brand.primary} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardLine} numberOfLines={1}>
                    {formatAddressLine(firstSaved)}
                  </Text>
                  <Text style={styles.cardCaptionBrand}>CURRENT LOCATION</Text>
                </View>
              </Pressable>
            ) : null}
          </>
        }
        ItemSeparatorComponent={() => <View style={styles.rowGap} />}
        renderItem={({ item: a, index: i }) => (
          <Pressable
            onPress={() => onSelect(a)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <View style={styles.cardIcon}>
              <LocationPinIcon size={18} color={colors.text.tertiary} />
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardLine} numberOfLines={1}>
                {formatAddressLine(a)}
              </Text>
              <Text style={styles.cardCaption}>{a.label ?? `ADDRESS ${i + 2}`}</Text>
            </View>
          </Pressable>
        )}
      />

      <Button label="Add new address" onPress={onAddNew} />
    </>
  );
});

interface AddProps {
  addresses: Address[];
  onClose: () => void;
  onSelect: (address: Address) => void;
}

const AddAddressView = memo(function AddAddressView({
  addresses,
  onClose,
  onSelect,
}: AddProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const currentLocation = addresses[0];

  // With no geocoder wired yet, "search results" are a placeholder: the
  // query stands in for the street line, and tapping "Save & Use" persists
  // it via POST /addresses. Swap this for a real autocomplete later.
  const parsed = useMemo(() => {
    const text = query.trim();
    if (!text) return null;
    const parts = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const [line, city = 'Lagos', state = 'Lagos', country = 'Nigeria'] = parts;
    return { line: line ?? text, city, state, country };
  }, [query]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!parsed) throw new Error('Enter an address to save');
      return addressesApi.create(parsed);
    },
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onSelect(created);
    },
  });

  const onPickCurrent = useCallback(() => {
    if (currentLocation) onSelect(currentLocation);
  }, [currentLocation, onSelect]);

  const onSave = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

  const subLabel = saveMutation.isPending
    ? 'Saving…'
    : saveMutation.error instanceof ApiError
      ? saveMutation.error.message
      : parsed
        ? `${parsed.city}, ${parsed.state}, ${parsed.country} — Tap to save & use`
        : '';

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Add new address</Text>
        <Pressable
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
        >
          <CloseIcon size={16} color={colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.search}>
        <SearchIcon size={20} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search street, city, district..."
          placeholderTextColor={colors.text.tertiary}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="words"
        />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {currentLocation ? (
          <Pressable
            onPress={onPickCurrent}
            style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <View style={[styles.listIcon, styles.cardIconHighlight]}>
              <NavigationArrowIcon size={18} color={colors.brand.primary} />
            </View>
            <View style={styles.listTextWrap}>
              <Text style={styles.listLine}>{formatAddressLine(currentLocation)}</Text>
              <Text style={styles.listSub}>Current location</Text>
            </View>
          </Pressable>
        ) : null}

        {parsed ? (
          <Pressable
            onPress={onSave}
            disabled={saveMutation.isPending}
            style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <View style={styles.listIcon}>
              <LocationPinIcon size={18} color={colors.text.tertiary} />
            </View>
            <View style={styles.listTextWrap}>
              <Text style={styles.listLine}>{parsed.line}</Text>
              <Text style={styles.listSub}>{subLabel}</Text>
            </View>
          </Pressable>
        ) : null}
      </ScrollView>
    </>
  );
});

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.md,
    minHeight: 320,
    maxHeight: '85%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h5, color: colors.text.primary },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { flexGrow: 0 },
  listContent: { paddingBottom: spacing.md },
  headerCard: { marginBottom: spacing.sm },
  rowGap: { height: spacing.sm },
  loader: { marginVertical: spacing.lg },

  // --- Pick view cards ---
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
  cardCaptionBrand: {
    ...typography.eyebrow,
    color: colors.brand.primary,
    marginTop: 2,
  },

  // --- Add view rows + search ---
  search: {
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.muted,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    padding: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listTextWrap: { flex: 1 },
  listLine: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  listSub: {
    ...typography.caption,
    color: colors.brand.primary,
    marginTop: 2,
  },

  pressed: { opacity: 0.85 },
});
