<script lang="ts">
  import { genCssVars } from 'utils/style';

  export let fileType = '';
  export let href = '';
  export let hrefStatic = '';
  export let name = '';
  export let width = '340px';
</script>

<a
  class="File"
  style={genCssVars({ width })}
  {href}
>
  {#if fileType === 'image'}
    <img src="{hrefStatic}?width=100" alt={name} />
  {/if}
</a>

<style lang="scss">
  @use '../style/color';
  @use '../style/misc';

  .File {
    display: flex;
    justify-content: center;
    overflow: visible;
    width: var(--width);
    aspect-ratio: 128 / 91;
    margin-top: 1%;
    background: color.get(navbar-bg);
    @include misc.rounded-outline-after(5px, 2px solid color.get(root-text-color));
    &:hover:after {
      border-color: color.get(active-color);
    }
  }

  img {
    max-width: 100%;
  }
</style>
