export function genCssVars(vars: Record<string, string>) {
  return Object.entries(vars).reduce((css, [key, val]) => (
    css + `--${key}:${val};`
  ), '');
}

export function onHover<T extends HTMLElement>(
  action: 'add' | 'remove' = 'add',
  elem: T,
  hoverListener: (event: Event) => void,
  hoverEndListener?: (event: Event) => void,
) {
  if (!elem) {
    return;
  }
  const eventAction = `${action}EventListener` as const;

  ['mouseenter', 'touchstart'].forEach((eventName) => {
    elem[eventAction](eventName, hoverListener);
  });

  if (hoverEndListener) {
    elem[eventAction]('mouseleave', hoverEndListener);

    // Touch screen devices
    document[eventAction]('touchmove', (event) => {
      event.preventDefault();
      const touch = (event as TouchEvent).touches[0];
      if (elem !== document.elementFromPoint(touch.pageX, touch.pageY)) {
        hoverEndListener(event);
      }
    });
    document[eventAction]('touchstart', (event) => {
      const touch = (event as TouchEvent).touches[0];
      if (elem !== document.elementFromPoint(touch.pageX, touch.pageY)) {
        hoverEndListener(event);
      }
    });
  }
}

export function toggleFullscreen<T extends Element>(element: T) {
  const key = getFullscreenKeys();
  if (!document[key.fullscreenElement]) {
    element[key.requestFullscreen]();
    return true;
  } else if (document[key.exitFullscreen]) {
    document[key.exitFullscreen]();
  }
  return false;
}

export function getFullscreenKeys() {
  if (fullscreenKeys) {
    return fullscreenKeys;
  }
  return fullscreenKeys = createFullscreenKeys();
}

let fullscreenKeys: ReturnType<typeof createFullscreenKeys>;

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
