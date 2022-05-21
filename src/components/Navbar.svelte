<script lang="ts">
  import ThemeToggle from 'components/ThemeToggle.svelte';
</script>

<div class="Navbar">
  <a class="Navbar__logo" href="/">Fylvur</a>
  <ThemeToggle />
</div>

<style lang="scss">
  @use '../style/color';
  @use '../style/misc';

  .Navbar {
    width: 100%;
    height: 50px;
    flex-shrink: 0;
    flex-grow: 0;
    gap: 1rem;
    display: flex;
    padding: 0 1rem;
    align-items: center;
    background: color.get(navbar-bg);
    @include misc.shadow();
  }

  .Navbar__logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 900;
    user-select: none;
    text-decoration: none;
    color: color.get(root-text-color)
  }
</style>
