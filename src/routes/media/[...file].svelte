<script lang="ts">
  import Video from 'components/Video.svelte';

  export let src = '';
  export let mime = '';
  export let name = '';

  $: fileType = mime.split('/')[0];
</script>

{#if fileType === 'video'}
  <Video bind:src bind:type={mime} />
{:else if fileType === 'image'}
  <img {src} alt={name} />
{/if}
