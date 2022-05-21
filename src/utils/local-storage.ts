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
    if (!item) {
      return fallback;
    }
    return isObject ? JSON.parse(item) as T : item;
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
