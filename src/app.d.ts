/// <reference types="@sveltejs/kit" />

type Typify<T> = { [K in keyof T]: Typify<T[K]> };

declare type FileInfo = Typify<{
  href: string;
  isFolder: boolean;
  mime?: string;
  name: string;
  type?: string;
}>;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}
