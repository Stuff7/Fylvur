<script lang="ts">
  import { dev } from '$app/env';
import Fire from 'components/icons/Fire.svelte';

  export let error: Error;
</script>

<div class="Error500">
  <div class="Error500__status-code">
    <span class="Error500__status-text">
      Internal
      <span class="flicker">
        Server
      </span>
      Error
    </span>
    <span class="Error500__status">500
      <span class="Error500__status-clip">500</span>
    </span>
    <p class="Error500__user-message">
      It's not you, it's me
      <span class="scale">🤖</span>
    </p>
  </div>
  {#if dev}
    <span class="Error500__dev-only">
      ⇓This is only visible in dev mode⇓
    </span>
    <pre class="Error500__debug">{error.stack}</pre>
  {/if}
  <div class="Error500__fire">
    <Fire /><Fire /><Fire />
    <div class="Error500__spacer" />
    <Fire /><Fire /><Fire />
  </div>
</div>

<style lang="scss">
  @use '../../style/color';
  @use '../../style/animation';

  .Error500 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 2rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    color: color.get(error-color);
    position: relative;
    background: color.get-rgba(root-text-color, 0.03);
    border-radius: 1rem;
    @keyframes bugs {
      25% {
        border-top-right-radius: 0;
        background: color.get-rgba(error-color, 0.015);
      }
      50% {
        border-top-left-radius: 0;
        background: color.get-rgba(error-color, 0.025);
      }
      75% {
        border-top-left-radius: 2rem;
        background: color.get-rgba(error-color, 0.035);
      }
    }
    animation: bugs steps(random(2), start) (random(5) + s) alternate infinite;
  }

  .Error500__status-text {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.25em;
    font-weight: 700;
    & .flicker {
      @include animation.pulse;
    }
  }

  .Error500__status-code {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto 0;
  }

  .Error500__status {
    position: relative;
    font-size: 10rem;
    line-height: 10rem;
    font-family: Koulen;
    letter-spacing: -0.01em;
    color: color.get(root-text-color);
    @keyframes colorSplit {
      25% { text-shadow: -0.02em 0 0 color.get(rose), 0.025em 0 0 color.get(indigo); }
      75% { text-shadow: -0.035em 0 0 color.get(rose), 0.04em 0 0 color.get(indigo); }
    }
    animation: colorSplit 1.25s steps(2, end) infinite;
  }
  
  .Error500__status-clip {
    @extend .Error500__status;
    position: absolute;
    top: 0;
    left: -2px;
    z-index: 10;

    color: color.get(root-bg);
    overflow: visible;
    clip-path: polygon(
    0% 0%, 100% 0, 100% 25%, 0 25%, 
    0 30%, 100% 30%, 100% 50%, 0 50%,
    0 60%, 100% 60%, 100% 65%, 0 65%,
    0 80%, 100% 80%, 100% 85%, 0 85%,
    0% 0%);

    @keyframes glitch {
      30% { left: 0; }
      to { left: 0; }
    }

    animation: glitch 1s steps(2, start) infinite;	
    
    &::before { 
      content: '500';
      @extend .Error500__status-clip;
      left: 0.05em;
      color: color.get(root-text-color);
      z-index: 9;
      
      // only way to get rid of pesky
      // vertical outline due to overlapping is
      // making polygon 1% taller
      clip-path: polygon(
      0% 0%, 100% 0, 100% 26%, 0 26%, 
      0 29%, 100% 29%, 100% 51%, 0 51%,
      0 59%, 100% 59%, 100% 66%, 0 66%,
      0 79%, 100% 79%, 100% 86%, 0 86%,
      0% 0%);
    }
  }

  .Error500__user-message {
    color: color.get(root-text-color);
    & > .scale {
      font-size: 2em;
      line-height: 1em;
    }
  }

  .Error500__dev-only {
    color: color.get(text-color-01);
    font-weight: 700;
  }

  .Error500__debug {
    background: color.get-rgba(console-bg, 0.7);
    color: color.get(console-text-color);
    width: 85%;
    padding: 1rem;
    border-radius: 5px;
    text-transform: none;
    overflow: hidden auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .Error500__fire {
    position: fixed;
    bottom: -3rem;
    display: flex;
    width: 100%;
  }

  .Error500__spacer {
    width: 100%;
  }
</style>
