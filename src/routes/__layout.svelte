<script lang="ts">
  import 'style/index.scss';
  import { onMount } from 'svelte';
  import preferences, { initPreferencesStore } from 'store/preferences';

  onMount(() => {
    initPreferencesStore();
    rootElement = document.getElementById('Fylvur') as HTMLDivElement;
  });

  let rootElement: HTMLDivElement | null = null;

  $: if (rootElement && preferences) {
    rootElement.dataset.theme = $preferences.theme;
  }
</script>

<slot />
