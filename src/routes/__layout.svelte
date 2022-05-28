<script lang="ts">
  import { dev } from '$app/env';
  import { onMount } from 'svelte';
  import 'style/index.scss';
  import preferences, { initPreferencesStore } from 'store/preferences';
  import Console from 'components/debug/Console.svelte';
  import Navbar from 'components/Navbar.svelte';

  onMount(() => {
    initPreferencesStore();
    rootElement = document.querySelector('html');
  });

  let rootElement: HTMLHtmlElement | null = null;

  $: if (rootElement && preferences) {
    rootElement.dataset.theme = $preferences.theme;
  }
</script>

{#if dev}
  <Console />
{/if}
<Navbar />
<slot />
