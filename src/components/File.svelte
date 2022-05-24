<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { formatTime } from 'utils/string';
  import { genCssVars, onHover } from 'utils/dom';
  import Play from 'components/icons/Play.svelte';

  export let fileType = '';
  export let href = '';
  export let hrefStatic = '';
  export let name = '';
  export let thumbnailSize = 100;
  export let width = '340px';
  export let video = {} as Video;

  let thumbnailTime = 50;
  let thumbnailChangeInterval = -1;
  let fileElem: HTMLAnchorElement;

  onMount(() => {
    onHover('add', fileElem, playPreview, stopPreview);
  });

  onDestroy(() => {
    onHover('remove', fileElem, playPreview, stopPreview);
  });

  function playPreview() {
    if (thumbnailChangeInterval === -1) {
      thumbnailChangeInterval = window.setInterval(() => (
        thumbnailTime = (thumbnailTime + 1) % 100
      ), 2e3);
    }
  }

  function stopPreview() {
    window.clearInterval(thumbnailChangeInterval);
    thumbnailTime = 50;
    thumbnailChangeInterval = -1;
  }

  $: previewing = thumbnailChangeInterval !== -1;
</script>

<a
  class="File"
  style={genCssVars({ width })}
  {href}
  bind:this={fileElem}
>
  {#if fileType === 'image'}
    <img src="{hrefStatic}?width={thumbnailSize}" alt={name} />
  {:else if fileType === 'video'}
    <img
      src="{hrefStatic}?tn-width={thumbnailSize}&tn-progress={thumbnailTime}{previewing ? '&tn-gif' : ''}"
      alt={name}
    />
    <div class="File__video-overlay">
      <Play class="File__play" />
      <span class="File__video-duration">
        {formatTime(video.duration)}
      </span>
    </div>
  {/if}
</a>

<style lang="scss">
  @use '../style/color';
  @use '../style/misc';

  .File {
    position: relative;
    display: flex;
    justify-content: center;
    overflow: visible;
    width: var(--width);
    flex: 0 0 auto;
    aspect-ratio: 16 / 9;
    margin-top: 1%;
    background: color.get(navbar-bg);
    @include misc.rounded-outline-after(5px, 2px solid color.get-rgba(root-text-color, 0.5));
    &:hover:after {
      border-color: color.get(active-color);
    }
  }

  img {
    max-width: 100%;
  }

  .File__video-overlay {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }

  .File__video-duration {
    padding: 4px;
    background: color.get-rgba(root-bg, 0.7);
    color: color.get(root-text-color);
    position: absolute;
    bottom: calc(var(--width) * 0.04);
    right: calc(var(--width) * 0.04);
    font-size: max(calc(var(--width) * 0.04), 10px);
  }

  :global(.File__play) {
    position: absolute;
    top: calc(var(--width) * 0.06);
    left: calc(var(--width) * 0.06);
    height: 17.7%;
    fill: color.get(root-text-color);
    stroke: color.get(root-text-color);
  }
</style>
