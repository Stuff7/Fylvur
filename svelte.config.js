import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getDirectories(path) {
  return readdirSync(path).filter(function (file) {
    return statSync(path+'/'+file).isDirectory();
  });
}

const srcDirs = getDirectories(path.resolve(__dirname, 'src'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
    vite: {
      envPrefix: 'FYLVUR_',
      resolve: {
        alias: srcDirs.reduce((aliases, dir) => {
          aliases[dir] = path.resolve(__dirname, 'src', dir);
          return aliases;
        }, {}),
      },
    },
	},
};

export default config;
