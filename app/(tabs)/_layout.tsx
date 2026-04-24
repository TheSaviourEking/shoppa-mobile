import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { TabAccountIcon } from '@/components/icons/TabAccountIcon';
import { TabMessagesIcon } from '@/components/icons/TabMessagesIcon';
import { TabPostIcon } from '@/components/icons/TabPostIcon';
import { TabShopIcon } from '@/components/icons/TabShopIcon';
import { colors, fontFamilies } from '@/theme';

interface Palette {
  bg: string;
  border: string;
  active: string;
  inactive: string;
}

// Post (home) sits on the purple surface → white active, light purple inactive.
const DARK: Palette = {
  bg: colors.brand.primary,
  border: '#986BF9',
  active: '#FFFFFF',
  inactive: '#DDCFFD',
};

// Everything else sits on a white surface → brand purple active, grey inactive.
const LIGHT: Palette = {
  bg: colors.surface.base,
  border: colors.border.base,
  active: colors.brand.primary,
  inactive: colors.text.hint,
};

function makeTabBarStyle(palette: Palette): {
  backgroundColor: string;
  borderTopColor: string;
  borderTopWidth: number;
  height: number;
  paddingTop: number;
  paddingBottom: number;
  paddingHorizontal: number;
} {
  return {
    backgroundColor: palette.bg,
    borderTopColor: palette.border,
    borderTopWidth: 1,
    height: 72,
    paddingTop: 11,
    paddingBottom: 11,
    paddingHorizontal: 16,
  };
}

function TabLabel({
  focused,
  label,
  palette,
}: {
  focused: boolean;
  label: string;
  palette: Palette;
}): React.JSX.Element {
  return (
    <Text
      numberOfLines={1}
      allowFontScaling={false}
      style={[
        styles.label,
        {
          fontFamily: focused ? fontFamilies.bodySemibold : fontFamilies.bodyMedium,
          color: focused ? palette.active : palette.inactive,
        },
      ]}
    >
      {label}
    </Text>
  );
}

// Custom tab button — kills the Android ripple and iOS opacity flash and
// stretches with flex: 1 so each tab takes an equal share of the bar.
function TabButton({
  children,
  style,
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      android_ripple={null}
      style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {children}
    </Pressable>
  );
}

const tint = (focused: boolean, palette: Palette): string => (focused ? palette.active : palette.inactive);

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarItemStyle: { height: 50, paddingHorizontal: 0 },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: makeTabBarStyle(DARK),
          tabBarIcon: ({ focused }) => <TabPostIcon color={tint(focused, DARK)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Post" palette={DARK} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarStyle: makeTabBarStyle(LIGHT),
          tabBarIcon: ({ focused }) => <TabShopIcon color={tint(focused, LIGHT)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Shop" palette={LIGHT} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarStyle: makeTabBarStyle(LIGHT),
          tabBarIcon: ({ focused }) => <TabMessagesIcon color={tint(focused, LIGHT)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Messages" palette={LIGHT} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarStyle: makeTabBarStyle(LIGHT),
          tabBarIcon: ({ focused }) => <TabAccountIcon color={tint(focused, LIGHT)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Account" palette={LIGHT} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 18.6,
    letterSpacing: -0.18,
    textAlign: 'center',
    marginTop: 2,
  },
});
