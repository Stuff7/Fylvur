<script lang="ts">
  export let src = '';
  export let type = '';
</script>

<div class="VideoContainer">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    autoplay
    controls
    {src}
    {type}
  >
    Sorry, your browser doesn't support this video.
  </video>
</div>

<style lang="scss">
  @use '../style/color';

  .VideoContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
