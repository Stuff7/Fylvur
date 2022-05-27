<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/env';
  import Fullscreen from './icons/Fullscreen.svelte';
  import Play from './icons/Play.svelte';
  import Slider from './Slider.svelte';
  import { getFullscreenKeys, toggleFullscreen } from 'utils/dom';

  export let src = '';
  export let type = '';

  let video: HTMLVideoElement;
  let currentTime = 0;
  let duration = 0;
  let isFullscreen = false;
  let paused = false;
  let videoContainer: HTMLDivElement;

  let fullscreenSupported: boolean;

  onMount(() => {
    try {
      getFullscreenKeys();
      fullscreenSupported = true;
    } catch(e) {
      fullscreenSupported = false;
    }
  });

  function togglePlay() {
    video[video.paused ? 'play' : 'pause']();
  }

  function fullscreen() {
    if (fullscreenSupported) {
      isFullscreen = toggleFullscreen(videoContainer);
    }
  }
</script>

<svelte:head><meta name="viewport" content="minimal-ui"></svelte:head>

{#if dev}
  <div class="Video" bind:this={videoContainer}>
    <div class="Video__controls">
      {#if fullscreenSupported}
        <div class="Video__controls-top">
          <button class="Video__button" on:click={fullscreen}>
            <Fullscreen enabled={isFullscreen} />
          </button>
        </div>
      {/if}
      <div
        class="Video__controls-center"
        on:click={togglePlay}
        on:dblclick={fullscreen}
      />
      <div class="Video__controls-bottom">
        <Slider
          max={duration}
          width="100%"
          bind:value={currentTime}
        />
        <button class="Video__button" on:click={togglePlay}>
          <Play {paused} />
        </button>
      </div>
    </div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class="Video__source"
      autoplay
      {src}
      {type}
      bind:this={video}
      bind:currentTime
      bind:duration
      bind:paused
    >
      Sorry, your browser doesn't support this video.
    </video>
  </div>
{:else}
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    autoplay
    controls
    {src}
    {type}
  >
    Sorry, your browser doesn't support this video.
  </video>
{/if}

<style lang="scss">
  @use '../style/color';

  .Video {
    position: relative;
    width: 100%;
    max-height: 100%;
    margin: auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .Video__source {
    width: 100%;
  }

  .Video__controls {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      color.get-rgba(root-bg, 0.5),
      transparent 58px
    ), linear-gradient(
      to top,
      color.get-rgba(root-bg, 0.5),
      transparent 58px
    );
    padding: 0.5rem 0.75rem;
  }

  .Video__controls-center {
    flex: 1;
  }

  .Video__button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    background: transparent;
    border: 0;
    width: 48px;
    height: 48px;
    cursor: pointer;
    & :global(*) {
      fill: color.get(root-text-color);
      filter: drop-shadow(3px 5px 2px color.get(root-shadow));
      width: 100%;
      height: 100%;
    }
  }
</style>
