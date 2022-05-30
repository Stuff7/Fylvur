<script lang="ts">
  import { range } from 'utils/math';

  export let animated = false;

  const tracePath = 'M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9\
s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1\
c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5\
S86.2,38.6,93.9,46.4z';
  const range6 = [...range(1, 7)];
</script>

<svg class="Infinity" viewBox="46.38 24.27 95.53 48.05" preserveAspectRatio="xMidyMid">
  <path class="Infinity__outline" d={tracePath} />
  {#each range6 as i (`Infinity__tracer--${i}`)}
    <path
      class="Infinity__tracer Infinity__tracer--{i} {animated ? 'animated' : ''}"
      d={tracePath}
    />
  {/each}
</svg>

<style lang="scss">
  @use '../../style/color';

  $dash-array: 260;
  $stroke-width: 10;
  $anim-speed: 1000ms;
  $colors: #F38181, #FCE38A, #E23E57, #95E1D3, #FFC4D0, #00DFFC;

  // Infinity elements
  .Infinity {
    position: relative;
    path {
      fill: none;
      stroke-width: $stroke-width;
      transform-origin: 50% 50%;
    }
  }

  .Infinity__outline {
    stroke: color.get(root-text-color);
    animation: hover $anim-speed * 4 linear infinite;
    transition: opacity 600ms;
  }

  .Infinity__tracer {
    stroke-linecap: round; 
    opacity: 0.8;
    &.animated {
      animation: tracer $anim-speed linear reverse infinite;
    }

    @each $c in $colors {
      $i: index($colors, $c);
      $s: calc($anim-speed / $i * length($colors));
      $d: calc($anim-speed / $i * -1 * length($colors) * 0.66);

      &--#{$i} {
        &.animated {
          stroke: $c;
        }
        stroke: color.get(root-text-color);
        animation-duration: $s !important;
        animation-delay: $d !important;
      }
    }
  }

  // Animations
  @keyframes tracer {
    0% {
      stroke-dasharray: 0, $dash-array;
      stroke-dashoffset: -$dash-array * 0.9;
    }
    25% {
      transform: translate(-2px, 2px);
    }
    50% {
      stroke-dasharray: calc($dash-array / 6), $dash-array;
      stroke-dashoffset: -$dash-array * 0.3;
    }
    65% { 
      transform: translateX(2px, -2px);
    }
    100% {
      stroke-dasharray: 4, $dash-array;
      stroke-dashoffset: 0;
    }
  }

  @keyframes hover {
    50% { transform: translateY(2px) scale(1.02); }
  }
</style>
