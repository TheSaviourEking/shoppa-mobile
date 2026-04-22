# assets/fonts/

Drop the Clash Grotesk Semibold TTF here to enable the brand display font.

## Why this folder is empty in git

Clash Grotesk is published by [Indian Type Foundry](https://www.fontshare.com/fonts/clash-grotesk) under a free license but isn't redistributable through git the way Google Fonts packages are. The `display` font family in `src/theme/typography.ts` falls back to Onest 700 Bold so the layout still looks right while the TTF is missing.

## How to enable Clash Grotesk

1. Download the family from https://www.fontshare.com/fonts/clash-grotesk → click **Download Family**.
2. Extract `ClashGrotesk-Semibold.ttf` from the zip and drop it here as `assets/fonts/ClashGrotesk-Semibold.ttf`.
3. Register it in `src/lib/fonts.ts`:

   ```ts
   import * as Font from 'expo-font';

   await Font.loadAsync({
     'ClashGrotesk-Semibold': require('../../assets/fonts/ClashGrotesk-Semibold.ttf'),
   });
   ```

4. Flip `display: 'Onest_700Bold'` → `display: 'ClashGrotesk-Semibold'` in `src/theme/typography.ts`.
5. Restart Metro (`expo start --clear`).
