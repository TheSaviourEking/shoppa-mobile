import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { TabAccountIcon } from '@/components/icons/TabAccountIcon';
import { TabMessagesIcon } from '@/components/icons/TabMessagesIcon';
import { TabPostIcon } from '@/components/icons/TabPostIcon';
import { TabShopIcon } from '@/components/icons/TabShopIcon';
import { colors, fontFamilies } from '@/theme';

const ACTIVE = '#FFFFFF';
const INACTIVE = '#DDCFFD';
const BORDER = '#986BF9';

interface TabLabelProps {
  focused: boolean;
  label: string;
}

function TabLabel({ focused, label }: TabLabelProps): React.JSX.Element {
  return (
    <Text
      numberOfLines={1}
      allowFontScaling={false}
      style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}
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

const tint = (focused: boolean): string => (focused ? ACTIVE : INACTIVE);

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarButton: (props) => <TabButton {...props} />,
        tabBarStyle: {
          backgroundColor: colors.brand.primary,
          borderTopColor: BORDER,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 11,
          paddingBottom: 11,
          paddingHorizontal: 16,
        },
        tabBarItemStyle: { height: 50, paddingHorizontal: 0 },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabPostIcon color={tint(focused)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Post" />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => <TabShopIcon color={tint(focused)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Shop" />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ focused }) => <TabMessagesIcon color={tint(focused)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Messages" />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => <TabAccountIcon color={tint(focused)} />,
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="Account" />,
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
  labelActive: {
    fontFamily: fontFamilies.bodySemibold,
    color: ACTIVE,
  },
  labelInactive: {
    fontFamily: fontFamilies.bodyMedium,
    color: INACTIVE,
  },
});
