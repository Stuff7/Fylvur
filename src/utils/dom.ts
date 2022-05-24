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

  HoverEventList.forEach((eventName) => {
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

const HoverEventList = [
  'mouseenter',
  'touchstart',
] as const;
