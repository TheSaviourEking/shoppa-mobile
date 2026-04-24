import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, typography } from '@/theme';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render + lifecycle errors from anywhere in the tree and renders
 * a recovery screen instead of letting the app unmount to a white screen.
 *
 * React error boundaries must be class components — hooks don't have an
 * equivalent of `componentDidCatch`. Everything else in the app stays
 * functional.
 *
 * Sentry hook-point is the `componentDidCatch` below. When Sentry gets
 * wired, swap the console.error for `Sentry.captureException(error, {...})`.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private readonly reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.body}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We hit an unexpected error. You can try again — if it keeps happening, close and reopen the app.
          </Text>
          {__DEV__ && this.state.error.message ? (
            <Text style={styles.devDetail} numberOfLines={6}>
              {this.state.error.message}
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={this.reset}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaLabel}>Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.md,
  },
  title: { ...typography.h2, color: colors.text.primary, textAlign: 'center' },
  message: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  devDetail: {
    fontFamily: fontFamilies.body,
    fontSize: 12,
    color: colors.status.error,
    backgroundColor: colors.surface.muted,
    padding: spacing.md,
    borderRadius: 8,
    maxWidth: 320,
  },
  cta: {
    marginTop: spacing.lg,
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPressed: { opacity: 0.85 },
  ctaLabel: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    color: colors.text.onBrand,
  },
});
