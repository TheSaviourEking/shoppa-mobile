import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { meApi } from '@/api/me';
import { postsApi } from '@/api/posts';
import { HomeBlobsBackground } from '@/components/decor/HomeBlobsBackground';
import { HomeTopBar } from '@/components/HomeTopBar';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { colors, fontFamilies, spacing, typography } from '@/theme';

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function PostHomeScreen(): React.JSX.Element {
  const [query, setQuery] = useState('');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: meApi.getMe,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: postsApi.listCategories,
  });

  const greeting = greetingForHour(new Date().getHours());
  const firstName = user?.firstName?.trim() ?? '';

  return (
    <View style={styles.root}>
      <HomeBlobsBackground />
      <HomeTopBar />
      <View style={styles.bodyWrap}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroBlock}>
            <Text style={styles.greeting}>
              {greeting}
              {firstName ? `, ${firstName}` : ''}
            </Text>
            <Text style={styles.hero}>Post a request. Get your Shoppa.</Text>
          </View>

          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="What do you want to buy?"
            placeholderTextColor="#BABABA"
            returnKeyType="search"
          />

          <Pressable
            onPress={() => router.push('/post/category')}
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
          >
            <Text style={styles.ctaLabel}>Get Offers</Text>
            <ChevronRightIcon size={20} color={colors.text.onBrand} strokeWidth={2} />
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsRow}
          >
            {categories?.length ? (
              categories.map((c) => (
                <Pressable key={c.id} style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
                  <Text style={styles.pillLabel}>{c.name}</Text>
                </Pressable>
              ))
            ) : (
              <ActivityIndicator color={colors.text.onBrand} />
            )}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand.primary },
  bodyWrap: { flex: 1 },
  scroll: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xl },

  heroBlock: { marginTop: 180 },
  greeting: {
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 21.7,
    letterSpacing: -0.21,
    color: colors.text.onBrand,
  },
  hero: {
    ...typography.hero,
    color: colors.text.onBrand,
    marginTop: spacing.xs,
  },

  search: {
    marginTop: spacing.lg,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface.muted,
    color: colors.text.primary,
    fontFamily: fontFamilies.body,
    fontSize: 14,
  },

  cta: {
    marginTop: spacing.md,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#2B1559',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaLabel: {
    ...typography.cta,
    color: colors.text.onBrand,
  },

  pillsRow: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    paddingRight: spacing.screenPadding,
  },
  pill: {
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 14,
    color: colors.text.onBrand,
  },

  pressed: { opacity: 0.85 },
});
