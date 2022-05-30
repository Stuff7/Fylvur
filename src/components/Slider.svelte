<script lang="ts">
  import { range } from 'utils/math';
  import { genCssVars } from 'utils/dom';

  export let min = 0;
  export let max = 100;
  export let step = 0.001;
  export let width = '2em';
  export let value = 0;
  export let stepIndicators = false;
  export let thumbRadius = '0.5em';

  $: length = max - min;
  $: rangePercentage = (value - min) * 100 / length;
  $: stepCount = stepIndicators ? 100 / (length / step) : 0;
  $: steps = stepCount ? [...range(stepCount, 100, stepCount)] : [];
</script>

<div
  class="Slider"
  style={genCssVars({
    rangePercentage: `${rangePercentage}%`,
    thumbRadius,
    width,
  })}
>
  <input
    class="Slider__input"
    type="range"
    {min}
    {max}
    {step}
    bind:value
    on:change
  />
  <div class="Slider__track">
    {#each steps as stepPos (`Slider__step-indicator--${stepPos}`)}
      <div
        class="Slider__step-indicator"
        style={genCssVars({ stepPos: `${stepPos}%` })}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../style/color';
  @use '../style/misc';

  @include misc.input-range-track((
    min-height: 1rem,
    background: transparent,
  ));

  @include misc.input-range-thumb((
    min-width: 1.25rem,
    min-height: 1.25rem,
  ));

  .Slider {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--width);
  }

  .Slider__step-indicator {
    position: absolute;
    left: var(--stepPos);
    height: 1em;
    width: 2px;
    background: color.get(root-bg);
  }

  .Slider__track {
    display: flex;
    flex: 1;
    align-items: center;
    background: color.get(root-text-color);
    height: 0.25em;
    border: 2px solid color.get(folder-bg);
    border-radius: 5px;
    pointer-events: none;
    &:before {
      content: "";
      background: color.get(folder-bg);
      width: var(--rangePercentage);
      height: 100%;
    }
    &:after {
      content: "";
      position: absolute;
      @include misc.circle(var(--thumbRadius));
      @include misc.shadow();
      background: color.get(folder-bg);
      left: var(--rangePercentage);
      transform: translateX(-50%);
    }
  }

  .Slider__input {
    position: absolute;
    cursor: pointer;
    left: -0.5em;
    width: calc(100% + 1em);
    height: 100%;
    opacity: 0;
    margin: 0;
    padding: 0;
  }
</style>
