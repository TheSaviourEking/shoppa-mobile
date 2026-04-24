# shoppa-mobile

Expo + TypeScript + expo-router app for the Shoppa Page 3 assessment.

## Stack

- **Expo SDK 52** with the new architecture enabled
- **expo-router** for file-based navigation (`app/`)
- **TanStack Query** for server state, with a global `QueryClient`
- **Zustand** for client state (auth tokens, ephemeral UI flags)
- **expo-secure-store** for refresh-token persistence
- **axios** with a 401 → refresh-and-retry interceptor (single-flight)
- **react-native-svg** (added later per icon) for figma-derived icons

## First-boot checklist

1. `cp .env.example .env` and pick the right `EXPO_PUBLIC_API_BASE_URL` for where you're running the backend (iOS sim → localhost, Android emulator → 10.0.2.2, physical device → LAN IP).
2. `npm install`
3. Start the backend (`cd ../backend && npm run start:dev`) so `/health` is reachable.
4. `npm run ios` (or `android`).
5. The first screen pings `GET /health` and shows the result. Green = backend reachable.

## Layout

```
mobile/
├── app/                  expo-router routes
│   ├── _layout.tsx       Providers (Query, SafeArea), auth hydrate on boot
│   └── index.tsx         /health ping screen
├── src/
│   ├── api/              axios client + envelope helpers
│   │   ├── client.ts     401-refresh-retry interceptor (single-flight)
│   │   ├── health.ts
│   │   └── types.ts
│   ├── lib/queryClient.ts
│   ├── store/auth.ts     Zustand + SecureStore for tokens
│   └── theme/            colors, spacing, radii, typography
└── assets/images/        per-screen image placeholders (see MANIFEST.md)
```

## Auth flow contract (matches backend)

- **Access token** lives in memory + SecureStore; sent as `Authorization: Bearer <…>` on every prefixed request.
- **Refresh token** lives in SecureStore. On any 401, the interceptor calls `POST /api/v1/auth/refresh` exactly once across concurrent in-flight requests, persists the new pair, and replays the original request. If refresh fails, the store is cleared (effective sign-out).
- The refresh endpoint itself uses `bareClient` (no interceptor) so failures can't loop.

## Backend assumptions

- Global API prefix `/api/v1`, except `/health` which is mounted at the root.
- Every successful response is wrapped in `{ success: true, data: T }`.
- Every error response is wrapped in `{ success: false, error: { code, message, details? } }`.
- Refresh code on 401 → `AUTH_INVALID_REFRESH` (we treat any 401 from refresh as sign-out).

## Demo accounts (seeded by `npm run db:seed` in the backend)

| Role      | Email                | Phone            | Password     |
| --------- | -------------------- | ---------------- | ------------ |
| Buyer     | `aidanma@shoppa.dev` | `+2348012345678` | `shoppa1234` |
| Shopper A | `adamu@shoppa.dev`   | `+2348023456789` | `shoppa1234` |
| Shopper B | `tolu@shoppa.dev`    | `+2348034567890` | `shoppa1234` |

Log in as the **buyer** to see the populated messages list, the
text + image conversation thread, and the paid + cancelled header
variants without driving any side flows.

## Conversation initiation flow (known gap)

Page 3 implements the **list, thread, composer, photo picker, action
sheet, and block-messages** screens. It does NOT implement the screen a
shopper would tap to _start_ a chat — that's the "browse posts → message
the buyer" flow which lives on **Page 1 / Page 2** of the figma (owned
by the other two engineers on the assessment).

The backend's `POST /api/v1/conversations` endpoint is fully wired and
tested; Page 3 just doesn't expose its only realistic call site. To make
the populated state visible without that screen, the backend's seed
script pre-creates four sample conversations against the buyer's three
posts — log in as the buyer (above) and they're already there.

If you want a quick `+ New Chat` dev affordance for testing, the cleanest
shape is a small bottom sheet on the messages screen that lists `GET
/posts/me` for the current user and a hardcoded counterparty list, then
calls `POST /conversations`. It's intentionally NOT in the build because
it isn't in the figma — the seed pre-population is the right
production-credible demo path.
