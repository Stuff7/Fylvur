export function genCssVars(vars: Record<string, string>) {
  return Object.entries(vars).reduce((css, [key, val]) => (
    css + `--${key}:${val};`
  ), '');
}

export function toggleFullscreen<T extends Element>(element: T, videoElement: HTMLVideoElement) {
  const { fullscreenKeys: key, isSafari } = getBrowserInfo();

  if (isSafari && videoElement.webkitSupportsFullscreen) {
    if (videoElement.webkitDisplayingFullscreen) {
      videoElement.webkitExitFullscreen();
      return false;
    }
    videoElement.webkitEnterFullscreen();
    return true;
  }

  if (document[key.fullscreenElement]) {
    document[key.exitFullscreen]();
    return false;
  }
  element[key.requestFullscreen]();
  return true;
}

export function getBrowserInfo() {
  if (browserInfo) {
    return browserInfo;
  }
  const isSafari = checkIfSafari();
  return browserInfo = {
    fullscreenKeys: isSafari ?
      {} as ReturnType<typeof createFullscreenKeys> :
      createFullscreenKeys(),
    isSafari,
  };
}

let browserInfo: {
  fullscreenKeys: ReturnType<typeof createFullscreenKeys>;
  isSafari: boolean;
};

function createFullscreenKeys() {
  const doc = document as Partial<Document>;
  if (doc.exitFullscreen) {
    return {
      exitFullscreen: 'exitFullscreen',
      fullscreenElement: 'fullscreenElement',
      fullscreenEnabled: 'fullscreenEnabled',
      requestFullscreen: 'requestFullscreen',
    } as const;
  } else if (doc.webkitExitFullscreen) {
    return {
      exitFullscreen: 'webkitExitFullscreen',
      fullscreenElement: 'webkitFullscreenElement',
      fullscreenEnabled: 'webkitFullscreenEnabled',
      requestFullscreen: 'webkitRequestFullscreen',
    } as const;
  } else if (doc.mozCancelFullscreen) {
    return {
      exitFullscreen: 'mozCancelFullscreen',
      fullscreenElement: 'mozFullscreenElement',
      fullscreenEnabled: 'mozFullscreenEnabled',
      requestFullscreen: 'mozRequestFullscreen',
    } as const;
  } else if (doc.msExitFullscreen) {
    return {
      exitFullscreen: 'msExitFullscreen',
      fullscreenElement: 'msFullscreenElement',
      fullscreenEnabled: 'msFullscreenEnabled',
      requestFullscreen: 'msRequestFullscreen',
    } as const;
  }
  throw 'Fullscreen not supported';
}

export function checkIfSafari() {
  return !!(
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
  );
}
