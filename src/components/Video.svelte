<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import globalKeyDown from 'actions/globalkeydown';
  import Fullscreen from './icons/Fullscreen.svelte';
  import Play from './icons/Play.svelte';
  import Infinity from './icons/Infinity.svelte';
  import Slider from './Slider.svelte';
  import { formatTime } from 'utils/string';
  import { checkIfSafari, toggleFullscreen } from 'utils/dom';

  export let src = '';
  export let type = '';

  onMount(() => {
    isSafari = checkIfSafari();
    isFirefox = navigator.userAgent.indexOf('Firefox') > 0;
    if (isSafari) {
      video.addEventListener('webkitendfullscreen', handleEndFullscreen);
    }
  });

  onDestroy(() => {
    window.clearTimeout(hideControlsTO);
    if (isSafari) {
      video.removeEventListener('webkitendfullscreen', handleEndFullscreen);
    }
  });

  let isFirefox = false;
  let isSafari = false;
  let video: HTMLVideoElement;
  let currentTime = 0;
  let duration = 0;
  let isFullscreen = false;
  let paused = false;
  let videoContainer: HTMLDivElement;
  let loop = true;
  let controlsVisible = false;
  let hideControlsTO = -1;

  function showControls(hideDelay = 3e3) {
    controlsVisible = true;
    window.clearTimeout(hideControlsTO);
    hideControlsTO = window.setTimeout(() => controlsVisible = false, hideDelay);
  }

  function handleEndFullscreen() {
    isFullscreen = false;
  }

  function togglePlay() {
    video[video.paused ? 'play' : 'pause']();
  }

  function fullscreen() {
    isFullscreen = toggleFullscreen(videoContainer, video);
  }

  function toggleLoop() {
    loop = !loop;
  }

  function progressBarListener({ target }: Event) {
    if (isFirefox) {
      video.currentTime = parseFloat((target as HTMLInputElement).value);
    }
  }

  function keyboardControl({ detail: key }: CustomEvent<string>) {
    showControls();
    switch (key) {
      case 'ArrowLeft': {
        const nextDuration = Math.max(currentTime - 10, 0);
        // Changing binded currentTime while video is playing doesn't work on Firefox
        if (isFirefox) {
          video.currentTime = nextDuration; break;
        }
        currentTime = nextDuration; break;
      }
      case 'ArrowRight': {
        const nextDuration = Math.min(currentTime + 10, duration);
        if (isFirefox) {
          video.currentTime = nextDuration; break;
        }
        currentTime = nextDuration; break;
      }
      case 'Space':
        togglePlay(); break;
      case 'KeyF':
        fullscreen(); break;
      case 'KeyL':
        loop = !loop; break;
    }
  }
</script>

<svelte:head><meta name="viewport" content="minimal-ui"></svelte:head>

<div
  class="Video"
  bind:this={videoContainer}
  use:globalKeyDown
  on:globalkeydown={keyboardControl}
>
  <div class="Video__controls" class:hover={controlsVisible}>
    <div class="Video__controls-top">
      <button class="Video__button" on:click={fullscreen}>
        <Fullscreen enabled={isFullscreen} />
      </button>
    </div>
    <div
      class="Video__controls-center"
      on:click={togglePlay}
      on:dblclick={fullscreen}
    />
    <Slider
      max={duration}
      thumbRadius="0.35em"
      width="100%"
      bind:value={currentTime}
      on:change={progressBarListener}
    />
    <div class="Video__controls-bottom">
      <button class="Video__button" on:click={togglePlay}>
        <Play {paused} />
      </button>
      <span class="Video__time" on:click={togglePlay}>
        {formatTime(currentTime)}/{formatTime(duration)}
      </span>
      <button class="Video__button" on:click={toggleLoop}>
        <Infinity animated={loop} />
      </button>
    </div>
  </div>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    class="Video__source"
    autoplay
    {loop}
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

<style lang="scss">
  @use '../style/color';

  .Video {
    position: relative;
    width: 100%;
    max-height: calc(100% - 50px);
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
    transition: opacity 0.25s;
    opacity: 0;
    &:hover, &.hover {
      opacity: 1;
    }
  }

  .Video__controls-center {
    flex: 1;
  }

  .Video__controls-bottom {
    display: flex;
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
      filter: drop-shadow(1px 2px 3px color.get(root-shadow));
      width: 100%;
      height: 100%;
    }
  }

  .Video__time {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.75rem;
    text-shadow: 1px 1px 2px color.get(root-shadow-neg);
  }
</style>
