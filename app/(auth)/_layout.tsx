import { Stack } from 'expo-router';

export default function AuthLayout(): React.JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="splash" options={{ animation: 'fade' }} />
      <Stack.Screen
        name="otp"
        options={{
          presentation: 'transparentModal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
