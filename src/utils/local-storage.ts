import { writable } from 'svelte/store';
import { stringify } from 'utils/string';

function prefix(key: string) {
  return `Fylvur__${key}`;
}

export function getLocalItem<T = string>(
  key: string,
  { isObject, fallback }: { isObject?: boolean, fallback?: T } = {},
) {
  const item = localStorage.getItem(prefix(key));
  try {
    if (!item && fallback) {
      return fallback;
    }
    return item && isObject ? JSON.parse(item) as T : item as unknown as T;
  } catch (e) {
    console.error('Error getting local storage item', item, '\n\n', e);
    throw e;
  }
}

export function setLocalItem<T>(key: string, value: T) {
  localStorage.setItem(prefix(key), stringify(value));
}

export function removeLocalItem(key: string) {
  localStorage.removeItem(prefix(key));
}

export function createLocalStore<T>(storeKey: string, initialState: T) {
  const store = writable(initialState);

  return [
    store,
    function() {
      store.set(
        getLocalItem(storeKey, {
          isObject: true,
          fallback: initialState,
        }),
      );

      store.subscribe((store) => {
        setLocalItem(storeKey, store);
      });
    },
  ] as const;
}
