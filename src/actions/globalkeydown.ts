export default function globalKeyDown<T extends HTMLElement>(node: T): SvelteActionReturnType {
  function keyDownEventListener(e: KeyboardEvent) {
    node.dispatchEvent(new CustomEvent('globalkeydown', {
      detail: e.code,
    }));
  };

  document.addEventListener('keydown', keyDownEventListener);

  return {
    destroy() {
      document.removeEventListener('keydown', keyDownEventListener);
    },
  };
}
