import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppFonts } from '@/lib/fonts';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/auth';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout(): React.JSX.Element | null {
  const fontsLoaded = useAppFonts();
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (fontsLoaded && hydrated) void SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

  if (!fontsLoaded || !hydrated) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="post" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="addresses" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
