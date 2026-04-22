import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

export default function MessagesScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.note}>Slice 4 will replace this with the conversations list.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.base },
  body: { flex: 1, paddingHorizontal: spacing.screenPadding, paddingTop: spacing.xxl },
  title: { ...typography.h1, color: colors.text.primary },
  note: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm },
});
