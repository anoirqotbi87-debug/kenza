import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import type { useAppStore as AppStore } from './useAppStore';

type StoreModule = { useAppStore: typeof AppStore };

/**
 * zustand lit `window.localStorage` et capture la référence à l'import du store :
 * le stub doit donc exposer `localStorage` sur `window`, et être posé avant l'import.
 */
const installStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (i: number) => Array.from(data.keys())[i] ?? null,
    get length() {
      return data.size;
    },
  };
  vi.stubGlobal('window', { localStorage: storage });
  vi.stubGlobal('localStorage', storage);
  return { data, storage };
};

/**
 * Le premier état du store doit être identique au rendu serveur.
 *
 * Lire `kenza_vip_active` à la création du store faisait diverger le premier rendu
 * client du HTML SSR pour un compte Pro : React levait l'erreur #418 et régénérait
 * tout l'arbre. Le flag en cache est restauré après montage par AuthAndPremiumSync.
 */
describe('État initial du store et hydratation', () => {
  let store: StoreModule;
  let storageRef: ReturnType<typeof installStorage>;

  beforeAll(async () => {
    storageRef = installStorage();
    store = (await import('./useAppStore')) as StoreModule;
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('démarre non-Premium, comme le rendu serveur', () => {
    expect(store.useAppStore.getState().isPremium).toBe(false);
  });

  it('ignore le flag VIP du localStorage à la création du store', async () => {
    vi.resetModules();
    installStorage({ kenza_vip_active: 'true' });

    const { useAppStore } = (await import('./useAppStore')) as StoreModule;
    expect(useAppStore.getState().isPremium).toBe(false);
  });

  it('accorde toujours le Premium après hydratation via setIsPremium', () => {
    // Le test précédent a remplacé les globals : on rétablit l'objet que le store a capturé.
    vi.stubGlobal('window', { localStorage: storageRef.storage });
    vi.stubGlobal('localStorage', storageRef.storage);

    store.useAppStore.getState().setIsPremium(true);
    expect(store.useAppStore.getState().isPremium).toBe(true);
    expect(storageRef.data.get('kenza_vip_active')).toBe('true');

    store.useAppStore.getState().setIsPremium(false);
    expect(store.useAppStore.getState().isPremium).toBe(false);
    expect(storageRef.data.get('kenza_vip_active')).toBeUndefined();
  });
});
