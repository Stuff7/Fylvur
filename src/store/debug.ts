import { dev } from '$app/env';
import { writable } from 'svelte/store';
import { stringify } from 'utils/string';

export interface DebugStore {
  consoleLogs: string[];
}

export const initialState: DebugStore = {
  consoleLogs: [],
};

const debug = writable(initialState);

export function log(...params: unknown[]) {
  if (dev) {
    // eslint-disable-next-line no-console
    console.log(...params);
    debug.update(store => ({
      consoleLogs: [...store.consoleLogs, params.map(stringify).join(' ')],
    }));
  }
}

export default debug;
