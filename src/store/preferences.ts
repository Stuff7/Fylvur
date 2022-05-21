import { writable } from 'svelte/store';
import { getLocalItem, setLocalItem } from 'utils/local-storage';

export const PREFERENCES_STORE_KEY = 'Preferences';

export type ThemeKey = 'light' | 'dark';

export interface PreferencesStore {
  theme: ThemeKey;
}

const initialState = getLocalItem(PREFERENCES_STORE_KEY, {
  isObject: true,
  fallback: {
    theme: 'dark',
  },
}) as PreferencesStore;

const preferences = writable(initialState);

preferences.subscribe((store) => {
  setLocalItem(PREFERENCES_STORE_KEY, store);
});

export default preferences;
