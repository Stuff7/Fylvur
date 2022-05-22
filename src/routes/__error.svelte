<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = ({ error, status }) => {
    return {
      props: {
        error,
        status,
      },
    };
  };
</script>

<script lang="ts">
  import Error404 from 'components/error/Error404.svelte';
import Error500 from 'components/error/Error500.svelte';
  import Navbar from 'components/Navbar.svelte';
  import { inRange } from 'utils/math';

  export let error = {} as Error;
  export let status = 0;
</script>

<Navbar />
<div class="Error">
  {#if inRange(status, 400, 499)}
    <Error404 />
  {:else}
    <Error500 {error} />
  {/if}
</div>

<style lang="scss">
  @use '../style/color';

  .Error {
    padding: 1rem;
    width: 100%;
    height: calc(100% - 50px);
    background: color.get(root-bg);
  }
</style>
