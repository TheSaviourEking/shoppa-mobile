// Minimal stub so api/client.ts (which imports Platform.OS) can be loaded in a
// Node test runtime. We only expose what the non-UI code paths actually touch.

export const Platform = {
  OS: 'ios' as 'ios' | 'android' | 'web',
  select: <T>(spec: { ios?: T; android?: T; default?: T; web?: T }): T | undefined =>
    spec.ios ?? spec.default,
};
