<script lang="ts">
  import Sun from 'components/icons/Sun.svelte';
  import Moon from 'components/icons/Moon.svelte';
  import { genCssVars } from 'utils/dom';
  import preferences from 'store/preferences';

  export let width = '3rem';
  let checked: boolean;

  preferences.subscribe(({ theme }) => checked = theme === 'dark');

  $: if (preferences) {
    $preferences.theme = checked ? 'dark' : 'light';
  }
</script>

<label class="ThemeToggle" style={genCssVars({ width })}>
  <input
    class="ThemeToggle__toggle-checkbox"
    type="checkbox"
    bind:checked
  />
  <div class="ThemeToggle__toggle-slot">
    <div class="ThemeToggle__sun-icon-wrapper">
      <Sun />
    </div>
    <div class="ThemeToggle__toggle-button"></div>
    <div class="ThemeToggle__moon-icon-wrapper">
      <Moon />
    </div>
  </div>
</label>

<style lang="scss">
  @use '../style/color';

  .ThemeToggle {
    cursor: pointer;
    width: var(--width);
    aspect-ratio: 2 / 1;
    position: relative;
    margin-left: auto;
    border-radius: 10em;
    overflow: hidden;
  }

  .ThemeToggle__toggle-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .ThemeToggle__toggle-slot {
      background-color: #374151;
      & .ThemeToggle__toggle-button {
        background-color: #374151;
        box-shadow: inset 0px 0px 0px calc(var(--width) * 0.0375) white;
        transform: translate(28%, -50%);
      }
      & .ThemeToggle__sun-icon-wrapper {
        opacity: 0;
        transform: translate(3em, -50%) rotate(0deg);
      }
      & .ThemeToggle__moon-icon-wrapper {
        opacity: 1;
        transform: translate(202%, -50%) rotate(-15deg);
      }
    }
  }

  .ThemeToggle__toggle-slot {
    position: relative;
    height: 100%;
    width: 100%;
    border: 2px solid #e4e7ec;
    border-radius: 10em;
    background-color: white;
    box-shadow: 0px calc(var(--width) * 0.005) calc(var(--width) * 0.025) color.get(active-color);
    transition: background-color 250ms;
  }

  .ThemeToggle__toggle-button {
    top: 50%;
    transform: translate(188%, -50%);
    position: absolute;
    width: 32.5%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: color.get(active-color);
    box-shadow: inset 0px 0px 0px calc(var(--width) * 0.0375) color.get(active-color);
    transition: background-color 250ms, border-color 250ms, transform 500ms cubic-bezier(.26,2,.46,.71);
  }

  .ThemeToggle__sun-icon-wrapper {
    position: absolute;
    width: 30%;
    aspect-ratio: 1 / 1;
    opacity: 1;
    top: 50%;
    transform: translate(33.66%, -50%) rotate(15deg);
    transform-origin: 50% 50%;
    transition: opacity 150ms, transform 500ms cubic-bezier(.26,2,.46,.71);
  }

  .ThemeToggle__moon-icon-wrapper {
    position: absolute;
    width: 30%;
    aspect-ratio: 1 / 1;
    opacity: 0;
    top: 50%;
    transform: translate(185.16%, -50%) rotate(0deg);
    transform-origin: 50% 50%;
    transition: opacity 150ms, transform 500ms cubic-bezier(.26,2.5,.46,.71);
  }
</style>
