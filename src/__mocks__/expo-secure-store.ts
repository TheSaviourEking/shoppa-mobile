// Jest runs outside a native runtime, so `expo-secure-store` can't be loaded
// for real. Stubs below are enough for the modules that pull it in
// transitively (the auth store) — every test that cares about secure-store
// behaviour should mock it explicitly per-case.

const store = new Map<string, string>();

export const getItemAsync = (key: string): Promise<string | null> => Promise.resolve(store.get(key) ?? null);

export const setItemAsync = (key: string, value: string): Promise<void> => {
  store.set(key, value);
  return Promise.resolve();
};

export const deleteItemAsync = (key: string): Promise<void> => {
  store.delete(key);
  return Promise.resolve();
};

export const __resetSecureStore = (): void => {
  store.clear();
};
