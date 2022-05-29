export default function hover<T extends HTMLElement>(node: T): SvelteActionReturnType {
  function hoverListener() {
    node.dispatchEvent(new CustomEvent('hover'));
  }

  function hoverEndListener() {
    node.dispatchEvent(new CustomEvent('hoverend'));
  };

  function mobileHoverEndListener(event: Event) {
    const touch = (event as TouchEvent).changedTouches[0];
    if (node !== document.elementFromPoint(touch.clientX, touch.clientY)) {
      node.dispatchEvent(new CustomEvent('hoverend'));
    }
  };

  node.addEventListener('mouseenter', hoverListener);
  node.addEventListener('touchstart', hoverListener);

  node.addEventListener('mouseleave', hoverEndListener);
  document.addEventListener('touchend', mobileHoverEndListener);

  return {
    destroy() {
      node.removeEventListener('mouseenter', hoverListener);
      node.removeEventListener('touchstart', hoverListener);
      node.removeEventListener('mouseleave', hoverEndListener);
      document.removeEventListener('touchend', mobileHoverEndListener);
    },
  };
}
