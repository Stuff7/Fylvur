<script lang="ts">
  import File from 'components/File.svelte';
  import Folder from 'components/Folder.svelte';
  import Navbar from 'components/Navbar.svelte';
  import Slider from 'components/Slider.svelte';
  import preferences from 'store/preferences';

  export let files: FileInfo[] = [];
  export let folder = '';

  $: currentFolder = folder.split('/').pop();
  $: itemSize = $preferences.itemSize;
  $: folderHistory = [
    { href: '/', name: 'Fylvur' },
    ...folder.split('/').map((name, i, list) => ({
        href: i + 1 < list.length ? `/${list.slice(0, i + 1).join('/')}` : '',
        name,
      })).filter(({ name }) => name),
  ];
</script>

<svelte:head>
  <title>Fylvur{currentFolder ? ` - ${currentFolder}` : ''}</title>
</svelte:head>

<Navbar />
<section class="Explorer">
  <p class="Explorer__history">
    {#if folderHistory.length > 1}
      {#each folderHistory as folderItem}
        {#if folderItem.href}
          <a href={folderItem.href}>{folderItem.name}</a>
        {:else}
          <span>{folderItem.name}</span>
        {/if}/
      {/each}
    {/if}
  </p>
  <div class="Explorer__tools">
    <Slider
      min={100}
      max={1000}
      step={100}
      stepIndicators
      width="20em"
      bind:value={$preferences.itemSize}
    />
    <span class="Explorer__item-count">
      {files.length} items
    </span>
  </div>
  <div class="Explorer__scroll">
    {#each files as file, i }
      {#if file.isFolder}
        <Folder
          href="/{file.href}"
          width="{itemSize}px"
        >
          {file.name}
        </Folder>
      {:else}
        <File
          href={file.href}
          name={file.name}
          thumbnailSize={itemSize}
          width="{itemSize}px"
        />
      {/if}
    {/each}
  </div>
</section>

<style lang="scss">
  @use '../../style/color';
  @use '../../style/text';

  .Explorer {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: calc(100% - 50px);
  }

  .Explorer__history {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    height: 44px;
    flex-wrap: nowrap;
    & > a:hover {
      text-decoration: underline;
    }
    & > * {
      @include text.ellipsis();
      text-overflow: clip;
    }
  }

  .Explorer__tools {
    display: flex;
    justify-content: space-between;
  }

  .Explorer__item-count {
    margin-left: auto;
  }

  .Explorer__scroll {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    overflow: hidden auto;
    flex: 1;
    padding: 0 0.25rem;
  }
</style>
