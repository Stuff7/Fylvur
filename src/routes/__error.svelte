<script context="module" lang="ts">
  import 'style/index.scss';
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
  export let error = {} as Error;
  export let status = 0;
</script>

<div class="ErrorPage">
  <h1 class="ErrorPage__title">
    <span>{error.name} {status}</span>
    <span>{error.message}</span>
  </h1>
  {#if error.cause}
    <span>{error.cause}</span>
  {/if}
  <pre class="ErrorPage__stack">
    {error.stack}
  </pre>
</div>

<style lang="scss">
  @use '../style/color';

  .ErrorPage {
    padding: 1rem;
    width: 100%;
    height: 100%;
    background: color.get(medium-grey);
  }

  .ErrorPage__title {
    &, & > * {
      color: color.get(error-color);
      font-size: 2rem;
      font-weight: 700;
    }
  }

  .ErrorPage__stack {
    white-space: pre-wrap;
  }
</style>
