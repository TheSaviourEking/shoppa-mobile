import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors, typography } from '@/theme';

interface TabLabelProps {
  focused: boolean;
  glyph: string;
  label: string;
}

function TabIcon({ focused, glyph, label }: TabLabelProps): React.JSX.Element {
  // Placeholder until per-tab SVG icons land (slice 2/3). Glyph + label only.
  const tint = focused ? colors.brand.primary : colors.text.tertiary;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 6 }}>
      <Text style={{ fontSize: 22, color: tint }}>{glyph}</Text>
      <Text style={[typography.caption, { color: tint, marginTop: 2 }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface.base,
          borderTopColor: colors.border.base,
          height: 84,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="+" label="Post" />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="◫" label="Shop" />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="✉" label="Messages" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} glyph="◯" label="Account" />,
        }}
      />
    </Tabs>
  );
}
