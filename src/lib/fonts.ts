import {
  Onest_400Regular,
  Onest_500Medium,
  Onest_600SemiBold,
  Onest_700Bold,
  useFonts as useGoogleFonts,
} from '@expo-google-fonts/onest';

export function useAppFonts(): boolean {
  // Metro's asset pipeline requires `require()` for static font binaries — there
  // is no `import` form that emits the bundle entry. The rule only fires here.
  const [loaded] = useGoogleFonts({
    Onest_400Regular,
    Onest_500Medium,
    Onest_600SemiBold,
    Onest_700Bold,
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
    'ClashGrotesk-Semibold': require('../../assets/fonts/ClashGrotesk-Semibold.ttf'),
  });
  return loaded;
}
