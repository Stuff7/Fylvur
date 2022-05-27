/// <reference types="@sveltejs/kit" />

type Typify<T> = { [K in keyof T]: Typify<T[K]> };

declare type FileDetails = Typify<{
  mime?: string;
  type?: string;
  video?: Video;
}>;

declare interface Video {
  duration: number;
}

declare type FileInfo = Typify<{
  details?: FileDetails;
  href: string;
  isFolder: boolean;
  name: string;
}>;

declare interface Element {
  msRequestFullscreen: Element['requestFullscreen'];
  mozRequestFullscreen: Element['requestFullscreen'];
  webkitRequestFullscreen: Element['requestFullscreen'];
}

declare interface Document {
  msExitFullscreen: Document['exitFullscreen'];
  msFullscreenElement: Document['fullscreenElement'];
  msFullscreenEnabled: Document['fullscreenEnabled'];
  mozCancelFullscreen: Document['exitFullscreen'];
  mozFullscreenElement: Document['fullscreenElement'];
  mozFullscreenEnabled: Document['fullscreenEnabled'];
  webkitExitFullscreen: Document['exitFullscreen'];
  webkitFullscreenElement: Document['fullscreenElement'];
  webkitFullscreenEnabled: Document['fullscreenEnabled'];
}

declare interface HTMLVideoElement {
  webkitDisplayingFullscreen: boolean;
  webkitExitFullscreen: Document['exitFullscreen'];
  webkitEnterFullscreen: Element['requestFullscreen'];
  webkitSupportsFullscreen: boolean;
  webkitWirelessVideoPlaybackDisabled: boolean;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}
