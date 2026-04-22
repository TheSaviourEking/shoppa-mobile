import { type ReactNode } from 'react';
import { StyleSheet, type StyleProp, View, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  background?: string;
  edges?: readonly Edge[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Standard screen wrapper. Defaults to white surface, top + bottom safe-area
 * insets honoured, and the brand 36px horizontal padding when `padded` is on.
 */
export function Screen({
  children,
  background = colors.surface.base,
  edges = ['top', 'bottom'],
  padded = true,
  style,
}: Props): React.JSX.Element {
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: background }]}>
      <View style={[styles.body, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
  padded: { paddingHorizontal: spacing.screenPadding },
});
