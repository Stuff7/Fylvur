<script lang="ts">
  import debugStore from 'store/debug';
</script>

<div class="Console">
  {#each $debugStore.consoleLogs as log}
    <pre class="Console__log" id="debug-console">{log}</pre>
  {/each}
</div>

<style lang="scss">
  @use '../../style/color';

  .Console {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: color.get-rgba(console-bg, 0.75);
    max-height: 50%;
    overflow: hidden auto;
    border: 1px solid color.get-rgba(console-text-color, 0.5);
    border-radius: 2px;
    &:empty {
      display: none;
    }
  }

  .Console__log {
    white-space: pre-wrap;
    word-break: break-all;
    padding: 0.25rem 1rem;
    border-bottom: 1px solid color.get-rgba(console-text-color, 0.5);
    color: color.get(console-text-color);
    margin: 0;
    &:before {
      content: '> ';
    }
  }
</style>
