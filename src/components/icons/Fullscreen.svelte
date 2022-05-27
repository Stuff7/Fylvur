<script lang="ts">
  export let enabled = false;
</script>

<svg class="Fullscreen" viewBox="0 0 16 16">
  <path d="m{enabled ? '10,16' : '0,6'} 2,0 0,-4 4,0 0,-2 -6,0 0,6 z" />
  <path d="m{enabled ? '0,10' : '10,0'} 0,2 4,0 0,4 2,0 0,-6 -6,0 z" />
  <path d="m{enabled ? '4,4' : '14,14'} -4,0 0,2 6,0 0,-6 -2,0 0,4 z" />
  <path d="m{enabled ? '12,0' : '2,10'} -2,0 0,6 6,0 0,-2 -4,0 0,-4 z" />
</svg>

<style lang="scss">
  @use '../../style/color';

  .Fullscreen {
    fill: color.get(root-text-color);
  }
</style>
