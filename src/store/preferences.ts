import { createLocalStore } from 'utils/local-storage';

export const PREFERENCES_STORE_KEY = 'Preferences';

export type ThemeKey = 'light' | 'dark';

export interface PreferencesStore {
  itemSize: number;
  theme: ThemeKey;
}

export const initialState: PreferencesStore = {
  itemSize: 100,
  theme: 'dark',
};

export const [
  preferences,
  initPreferencesStore,
] = createLocalStore(PREFERENCES_STORE_KEY, initialState);

export default preferences;
