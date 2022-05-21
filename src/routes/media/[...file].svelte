<script lang="ts">
  import Image from 'components/Image.svelte';
  import Video from 'components/Video.svelte';

  export let src = '';
  export let mime = '';
  export let name = '';

  $: fileType = mime.split('/')[0];
</script>

{#if fileType === 'video'}
  <Video bind:src bind:type={mime} />
{:else if fileType === 'image'}
  <Image bind:src bind:alt={name} />
{/if}
