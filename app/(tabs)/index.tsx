import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError } from '@/api/client';
import { getHealth } from '@/api/health';
import { colors, radii, spacing, typography } from '@/theme';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export default function PostHomeScreen(): React.JSX.Element {
  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  });

  const reachable = !!data && !error;
  const errorMessage = error instanceof ApiError ? `${error.code}: ${error.message}` : error?.message;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.body}>
        <Text style={styles.title}>Shoppa</Text>
        <Text style={styles.subtitle}>Slice 1 — backend reachability</Text>

        <View style={[styles.card, { borderColor: reachable ? colors.status.success : colors.status.error }]}>
          <Text style={styles.label}>API base</Text>
          <Text style={styles.value}>{BASE_URL}</Text>

          <Text style={[styles.label, styles.labelSpaced]}>Status</Text>
          <Text
            style={[styles.statusBadge, { color: reachable ? colors.status.success : colors.status.error }]}
          >
            {isFetching ? 'pinging…' : reachable ? `${data.status} · db ${data.db}` : 'unreachable'}
          </Text>

          {data ? (
            <>
              <Text style={[styles.label, styles.labelSpaced]}>Uptime</Text>
              <Text style={styles.value}>{data.uptimeSeconds}s</Text>
              <Text style={[styles.label, styles.labelSpaced]}>Server time</Text>
              <Text style={styles.value}>{data.timestamp}</Text>
            </>
          ) : null}

          {error ? (
            <>
              <Text style={[styles.label, styles.labelSpaced]}>Error</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </>
          ) : null}
        </View>

        <Pressable
          onPress={() => {
            void refetch();
          }}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>{isFetching ? 'Pinging…' : 'Ping again'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  body: { flex: 1, paddingHorizontal: spacing.screenPadding, paddingTop: spacing.xxl },
  title: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs },
  card: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    backgroundColor: colors.surface.softer,
  },
  label: { ...typography.caption, color: colors.text.tertiary },
  labelSpaced: { marginTop: spacing.md },
  value: { ...typography.body, color: colors.text.primary, marginTop: spacing.xs },
  statusBadge: { ...typography.cta, marginTop: spacing.xs },
  errorText: { ...typography.body, color: colors.status.error, marginTop: spacing.xs },
  button: {
    marginTop: spacing.xl,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { opacity: 0.85 },
  buttonLabel: { ...typography.cta, color: colors.text.onBrand },
});
