# Page 3 image manifest

Every `imageRef` from the figma JSON, grouped by where it lives. Export each from figma at the listed dimensions and drop into the matching folder using the suggested filename.

How to export from figma: select the node → right-click → Export → PNG @2x (or @3x for hero images).

**Priority** — what to grab first if you're triaging time:

1. `splash/onboarding-hero.png` — visible on the very first screen
2. `avatars/default-avatar.png` — appears in 29 places across Account + Messages
3. `avatars/message-list-avatar.png` — the inbox row avatar (30 uses)
4. `chat/chat-photo-1.png` — only photo shown in a chat bubble
5. `categories/category-thumb-1.png` — small thumbnail in the category list
6. `photo-picker/*` — all 17 are mock thumbnails inside the iOS-style PhotosPicker bottom sheet. Solid-color stand-ins or a single repeated stock photo are fine if pixel-perfection on this screen isn't worth 17 round-trips.

## splash/

- **onboarding-hero.png** — `224×205` — used 1× — `imageRef 83f4136ac374…`
  - Figma node: `Page 3 > Splash Screen > Onboarding > img > image`
  - On: Splash Screen / Onboarding

## avatars/

- **default-avatar.png** — `139×139` — used 29× — `imageRef ba0e6d6920ac…`
  - Figma node: `Page 3 > Create Account > Create account > Frame 2087326944 > Frame 2087327022 > Pfp > IMG_4668 1`
  - On: Create Account / Create account · Messages / direct message · Account and settings / Account
- **message-list-avatar.png** — `48×36` — used 30× — `imageRef 85749767e374…`
  - Figma node: `Page 3 > Messages > Messages > Frame 2087326985 > Message list > Frame 787 > Image`
  - On: Messages / Messages · Messages / direct message

## chat/

- **chat-photo-1.png** — `260×249` — used 20× — `imageRef a4dd0d708364…`
  - Figma node: `Page 3 > Messages > direct message > Frame 6945 > Chat bubbles > ✏️ Photo`
  - On: Messages / direct message

## categories/

- **category-thumb-1.png** — `40×32` — used 2× — `imageRef d59f62511fe2…`
  - Figma node: `Page 3 > Create Post > Create post > Frame 2087326944 > Frame 2087327040 > Frame 2087327035 > category list > items > image`
  - On: Create Post / Create post

## photo-picker/

- **picker-01.png** — `137×137` — used 4× — `imageRef 6adcf69bac84…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-02.png** — `137×137` — used 2× — `imageRef 8f7283d2da0c…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-03.png** — `137×137` — used 6× — `imageRef 0b4176aa7d7d…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-04.png** — `137×137` — used 4× — `imageRef 56beae1d7823…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-05.png** — `137×137` — used 6× — `imageRef f997a9c373c6…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-06.png** — `137×137` — used 6× — `imageRef f38e0d58d0c1…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-07.png** — `126×125` — used 10× — `imageRef 582720836168…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-08.png** — `126×125` — used 2× — `imageRef f084f0f22186…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-09.png** — `125×125` — used 6× — `imageRef 663880b4d5a1…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-10.png** — `126×125` — used 6× — `imageRef ca45fd7c0d19…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-11.png** — `126×125` — used 4× — `imageRef 1fcf900b2408…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-12.png** — `125×125` — used 4× — `imageRef e83fb73a43a7…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-13.png** — `125×125` — used 4× — `imageRef 0da015b41882…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-14.png** — `125×125` — used 4× — `imageRef ece566956414…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message
- **picker-15.png** — `126×125` — used 2× — `imageRef d58af7889477…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-16.png** — `125×125` — used 2× — `imageRef af34d888af4c…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo`
  - On: Messages / direct message
- **picker-17.png** — `125×125` — used 2× — `imageRef 3d279ab2e938…`
  - Figma node: `Page 3 > Messages > direct message > PhotoPicker > _PhotoPicker-photoGrid > Row > _PhotosPicker-photo > ✏️ Photo`
  - On: Messages / direct message

---

## Quick reference: imageRef → file path

| imageRef hash                              | file                              |
| ------------------------------------------ | --------------------------------- |
| `83f4136ac374953693938dbd5d4fbfbc6bbdfef5` | `splash/onboarding-hero.png`      |
| `ba0e6d6920ac46e11e33a4f84f866d6fb7eb5f4c` | `avatars/default-avatar.png`      |
| `85749767e374d24873c53f8242796cc56bb418dc` | `avatars/message-list-avatar.png` |
| `a4dd0d7083646df70b2feceb678e2739ebcaf169` | `chat/chat-photo-1.png`           |
| `d59f62511fe2626e8cd565a1336fe8ed690a1415` | `categories/category-thumb-1.png` |
| `6adcf69bac8498e0081480c688dc0360385dd538` | `photo-picker/picker-01.png`      |
| `8f7283d2da0c57481c004a4d8ead74500b681665` | `photo-picker/picker-02.png`      |
| `0b4176aa7d7dbe0137c16b7099cca1f21ff91d49` | `photo-picker/picker-03.png`      |
| `56beae1d7823825df9195edf776258163d2cd2af` | `photo-picker/picker-04.png`      |
| `f997a9c373c698b791056d942a6eea2bc3081be5` | `photo-picker/picker-05.png`      |
| `f38e0d58d0c12a10504e5ffc1cb1aed56bf93112` | `photo-picker/picker-06.png`      |
| `582720836168d895ea43a1cda52f5ae361c57e9c` | `photo-picker/picker-07.png`      |
| `f084f0f2218632eada9e8c76ca7a9c055de4a619` | `photo-picker/picker-08.png`      |
| `663880b4d5a142e4b04dbbbaba0c47fcc42cf537` | `photo-picker/picker-09.png`      |
| `ca45fd7c0d199b92568c3903fad0098262024e64` | `photo-picker/picker-10.png`      |
| `1fcf900b2408ffa0a7995c38e1a344b48169e5b3` | `photo-picker/picker-11.png`      |
| `e83fb73a43a75352a707eb3cbc892ac6fc182894` | `photo-picker/picker-12.png`      |
| `0da015b418829dae930d5ac504d45f50ea38ed97` | `photo-picker/picker-13.png`      |
| `ece56695641408f55aebaa12a75c6365e423751d` | `photo-picker/picker-14.png`      |
| `d58af7889477d24c76784355d97417c02795686c` | `photo-picker/picker-15.png`      |
| `af34d888af4cccaae75549bbdfd032a5384412fb` | `photo-picker/picker-16.png`      |
| `3d279ab2e9387260b7224e46a87ba27b564582b3` | `photo-picker/picker-17.png`      |
