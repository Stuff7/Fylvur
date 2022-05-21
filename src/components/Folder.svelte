<script lang="ts">
  import { genCssVars } from 'utils/style';

  export let href = '';
  export let width = '340px';
</script>

<a
  class="Folder"
  style={genCssVars({ width })}
  {href}
>
  <div class="Folder__wrapper">
    <div class="Folder__paper">
      <div class="Folder__paper-text" />
    </div>
    <div class="Folder__front">
      <p class="Folder__label"><slot /></p>
    </div>
  </div>
</a>

<style lang="scss">
  @use '../style/text';
  @use '../style/color';

  $folder-bg: color.get(folder-bg);
  $folder-tc: color.get(folder-tc);

  .Folder {
    display: block;
    overflow: visible;
    width: var(--width);
    aspect-ratio: 128 / 91;
    margin-top: 1%;
  }

  /* Folder's back */
  .Folder__wrapper {
    perspective: calc(var(--width) * 1.5);
    width: var(--width);
    aspect-ratio: 34 / 10;
    background: $folder-bg;
    position: relative;
    border-top-right-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s;
    /* Folder's tab */
    &::before {
      width: 23.52%;
      aspect-ratio: 4 / 1;
      content: '';
      background: $folder-bg;
      color: $folder-tc;
      position: absolute;
      top: -20%;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    &:hover {
      transform: translate(-0.3%, -0.35%);
      & .Folder__front {
        transform: rotateX(-15deg);
      }
      & .Folder__paper {
        transform: rotate(-4deg) translateY(-10%) translateZ(-5px);
      }
    }
  }

  .Folder__label {
    width: 100%;
    position: absolute;
    color: $folder-tc;
    text-align: center;
    margin: 0;
    font-size: calc(var(--width) * 0.15);
    white-space: pre-wrap;
    padding: 0 0.5rem;
    @include text.ellipsis(3);
  }

  .Folder__front {
    display: flex;
    align-items: center;
    width: var(--width);
    aspect-ratio: 34 / 21;
    position: absolute;
    background: $folder-bg;
    top: 32%;
    box-shadow: 0 0 20px 2px color.get-rgba(root-shadow, 0.3);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    transform: rotateX(-10deg);
    transition: transform 0.4s;
  }

  .Folder__paper {
    width: 94.12%;
    aspect-ratio: 32 / 20;
    position: absolute;
    background: #fff;
    top: 6%;
    left: 3%;
    box-shadow: 0 0 5px 5px color.get-rgba(root-shadow, 0.05);
    transform: rotate(-1deg) translateZ(-5px);
    border: 1px solid #ddd;
    transition: transform 0.2s;
  }

  .Folder__paper-text  {
    content: '';
    background: repeating-linear-gradient(
      0deg,
      #ffffff,
      #ffffff 3%,
      #333333 3%,
      #333333 6%,
    );
    position: absolute;
    top: -11%;
    left: 19.11%;
    width: 59%;
    aspect-ratio: 20 / 29;
    color: $folder-tc;
    font-size: 17.65%;
    line-height: 8.8%;
    transform: rotate(-90deg);
    opacity: 0.15;
  }
</style>
