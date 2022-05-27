<script lang="ts">
  export let paused = true;

  let pauseToPlay1: SVGAnimateElement;
  let playToPause1: SVGAnimateElement;
  let pauseToPlay2: SVGAnimateElement;
  let playToPause2: SVGAnimateElement;

  $: {
    if (paused) {
      pauseToPlay1?.beginElement();
      pauseToPlay2?.beginElement();

    } else {
      playToPause1?.beginElement();
      playToPause2?.beginElement();

    }
  }
</script>

<svg class="Play" viewBox="0 0 360 432">
  <polygon class="rect1" points="144,396 0,396 0,36 144,36">
    <animate
      begin="indefinite"
      fill="freeze"
      attributeName="points"
      dur="250ms"
      to="360,216 0,432 0,0 360,216"
      bind:this={pauseToPlay1}
    />
    <animate
      begin="indefinite"
      fill="freeze"
      attributeName="points"
      dur="50ms"
      to="144,396 0,396 0,36 144,36"
      bind:this={playToPause1}
    />
  </polygon>  
  <polygon class="rect2" points="324,396 180,396 180,36 324,36">
    <animate
      begin="indefinite"
      fill="freeze"
      attributeName="points"
      dur="50ms"
      to="0,396 0,396 0,36 0,36"
      bind:this={pauseToPlay2}
    />
    <animate
      begin="indefinite"
      fill="freeze"
      attributeName="points"
      dur="250ms"
      to="324,396 180,396 180,36 324,36"
      bind:this={playToPause2}
    />
  </polygon> 
</svg>

<style lang="scss">
  @use '../../style/color';

  .Play {
    fill: color.get(root-text-color);
  }
</style>
