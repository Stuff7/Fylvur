<script lang="ts">
  import { onMount } from 'svelte';
  import { formatTime } from 'utils/string';
  import { genCssVars } from 'utils/dom';
  import hover from 'actions/hover';
  import Play from 'components/icons/Play.svelte';

  export let href = '';
  export let name = '';
  export let thumbnailSize = 100;
  export let width = '340px';

  let details = {} as FileDetails;
  let thumbnailTime = 0;
  let thumbnailChangeInterval = -1;

  onMount(async () => {
    details = (await fetch(`/file-details/${href}`)
      .then<{ details: FileDetails }>(res => res.json())
    ).details;
  });

  function playPreview() {
    if (thumbnailChangeInterval === -1) {
      thumbnailChangeInterval = window.setInterval(() => (
        thumbnailTime = (thumbnailTime + 10) % videoDuration
      ), 1500);
    }
  }

  function stopPreview() {
    window.clearInterval(thumbnailChangeInterval);
    thumbnailTime = videoDuration / 2;
    thumbnailChangeInterval = -1;
  }

  $: videoDuration = (details.video?.duration || 0);
  $: previewing = thumbnailChangeInterval !== -1;
  $: thumbnailTime = videoDuration / 2;
</script>

<a
  class="File"
  style={genCssVars({ width })}
  href="/media/{href}"
  use:hover
  on:hover={playPreview}
  on:hoverend={stopPreview}
>
  {#if details.type === 'image'}
    <img src="/file/{href}?img-width={thumbnailSize}" alt={name} />
  {:else if details.type === 'video'}
    <img
      src="/file/{href}?tn-progress={thumbnailTime || encodeURI('50%')}&tn-{previewing ? 'gif' : 'img'}"
      alt={name}
    />
    <div class="File__video-overlay">
      <Play />
      <span class="File__video-duration">
        {formatTime(videoDuration)}
      </span>
    </div>
  {:else}
    <div class="File__placeholder">
      <span class="File__placeholder-text">
        {name}
      </span>
    </div>
  {/if}
</a>

<style lang="scss">
  @use '../style/color';
  @use '../style/misc';
  @use '../style/text';

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

  .File__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .File__placeholder-text {
    @include text.ellipsis(3);
    text-align: center;
  }

  img {
    max-width: 100%;
  }

  .File__video-overlay {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    & :global(.Play) {
      position: absolute;
      top: calc(var(--width) * 0.06);
      left: calc(var(--width) * 0.06);
      height: 17.7%;
      fill: color.get(root-text-color);
      stroke: color.get(root-text-color);
    }
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
</style>
