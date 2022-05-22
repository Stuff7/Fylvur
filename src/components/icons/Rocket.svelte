<script>
  import { range } from 'utils/math';
  
  const range4 = [...range(1, 4)];
  const range16 = [...range(1, 16)];
</script>

<div class="scene">
  <div class="wing-left"></div>
  <div class="wing-right"></div>
  <div class="exhaust"></div>
  <div class="capsule">
    <div class="top">
      <div class="shadow"></div>
    </div>
    <div class="base"></div>
  </div>
  <div class="window-big"></div>
  <div class="window-small"></div>
  {#each range4 as i}
  <div class="fire-{i}" />
  {/each}
  {#each range4 as i}
  <div class="spark-{i}" />
  {/each}
  {#each range16 as i}
  <div class="star star--{i}" />
  {/each}
</div>

<style lang="scss">
  @use '../../style/color';

  $color-purple: color.get(folder-bg);
  $color-darkpurple: #272425;
  $color-orange: #EF8B32;
  $color-red: #E82134;
  $color-bg: color.get(root-bg);

  .scene {
    width: 202px;
    height: 300px;
    animation: vibration 0.2s infinite;
    position: relative;
  }
  
  .wing-left { 
    position: absolute;
    z-index: 10;
    height: 103px;
    width: 0px;
    padding: 0px;
    top: 82px;
    left: 16px;
    transform: rotate(10deg) skew(5deg);
    border-top: 21px solid transparent;
    border-right: 38px solid $color-purple;
    border-bottom: 19px solid transparent;
    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: -50px; 
      height: 0px; 
      width: 0px; 
      border-top: 20px solid transparent; 
      border-right: 50px solid $color-bg; 
      border-bottom: 50px solid transparent;
    }
  }
  
  .wing-right { 
    position: absolute;
    z-index: 10;
    height: 103px;
    width: 0px;
    padding: 0px;
    top: 62px;
    right: 17px;
    transform: rotate(-10deg) skew(-5deg);
    border-top: 0 solid transparent;
    border-right: 40px solid $color-purple;
    border-bottom: 15px solid transparent;
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: -33px;
      left: -19px;
      height: 0px;
      width: 0px;
      border-top: 36px solid transparent;
      border-right: 68px solid $color-bg;
      border-bottom: 45px solid transparent;
    }
  }
  
  .exhaust {
    position: absolute;
    z-index: 20;
    top: 156px;
    left: 51px;
    height: 0px;
    width: 101px;
    border-top: 23px solid $color-purple;
    border-left: 9px solid transparent;
    border-right: 8px solid transparent;
  }
  
  .capsule {
    position: absolute;
    z-index: 30;
    background: $color-bg;
    left: 46px;
    top: 5px;
    width: 111px;
    height: 156px;
    opacity: 1;
    overflow:hidden;
    & .base {
      position: absolute;
      background: #ccc;
      width: 112px;
      height: 94px;
      top: 62px;
      left: 0px;
      background: linear-gradient(to right, color.get(root-text-color) 0%, color.get(root-text-color) 65%, color.get(text-color-01) 65%, color.get(text-color-01) 100%);
    }
    & .top {
      position: absolute;
      height: 0px;
      width: 0px;
      padding: 0px;
      left: 0;
      border-left: 56px solid transparent;
      border-right: 56px solid transparent;
      border-bottom: 62px solid color.get(root-text-color);
      &:after {
        content: "";
        position: absolute;
        height: 0px;
        width: 0px;
        border-left: 0px solid transparent;
        border-right: 156px solid transparent;
        border-bottom: 84px solid $color-bg;
        transform: skew(42deg);
        top: -14px;
        left: 25px;
        z-index: 50;
      }
      .shadow {
        position: absolute;
        height: 0px;
        width: 0px;
        border-left: 20px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 90px solid transparent;
        transform: skew(26deg);
        top: -20px;
        left: -3px;
        z-index: 40;
      }
    }
  }
  
  .window-big {
    width: 70px;
    height: 70px;
    background: $color-purple;
    border-radius: 8em;
    position: absolute;
    z-index: 40;
    top: 57px;
    left: 66px;
  }
  
  .window-small {
    width: 44px;
    height: 44px;
    background: $color-darkpurple;
    border-radius: 8em;
    position: absolute;
    z-index: 50;
    top: 70px;
    left: 79px;
  }
  
  .propulsed__slow {
    animation: fire_propulsion 0.3s ease-in infinite; 
  }
  
  .main_fire {
    animation:main_fire 0.1s cubic-bezier(0.175, 0.885, 0.420, 1.410) infinite;
  }
  
  .fire-1 {
    position: absolute;
    height: 70px;
    width: 70px;
    top: 169px;
    transform-origin: 50% 50%;
    transform: rotate(-40deg) skew(1deg, -11deg);
    z-index: 10;
    left: 64px;
    background: linear-gradient(135deg, #EF8B32 0%, #EF8B32 50%, #E82134 50%, #E82134 100%);
    
    @extend .main_fire;
  }
  
  .fire-2 {
    display: none;
    position: absolute;
    height: 55px;
    width: 55px;
    top: 180px;
    transform-origin: 50% 50%;
    transform: rotate(-33deg) skew(0deg, -30deg);
    z-index: 15;
    left: 58px;
    background: linear-gradient(135deg, #E82134 0%, #E82134 50%, #EF8B32 50%, #EF8B32 100%);
    
    @extend .propulsed__slow;
    animation-delay:0.2s;
  }
  
  .fire-3 {
    position: absolute;
    height: 22px;
    width: 22px;
    top: 196px;
    left: 58px;
    transform-origin: 50% 50%;
    transform: rotate(-33deg) skew(0deg, -30deg);
    z-index: 20;
    background: linear-gradient(135deg, $color-orange 0%, $color-orange 50%, $color-red 50%, $color-red 100%);
    
    @extend .propulsed__slow;
    animation-delay:0.2s;
  }
  
  .fire-4 {
    position: absolute;
    height: 22px;
    width: 22px;
    top: 200px;
    transform-origin: 50% 50%;
    transform: rotate(-33deg) skew(0deg, -30deg);
    z-index: 20;
    left: 126px;
    background: linear-gradient(135deg, $color-red 0%, $color-red 50%, $color-orange 50%, $color-orange 100%);
    
    @extend .propulsed__slow;
    
  }
  
  .propulsed {
    animation: dancing_fire 0.24s infinite; 
  }
  
  .spark-1 {
    position: absolute;
    bottom: 177px;
    z-index: 20;
    right: 70px;
    width: 12px;
    height: 12px;
    background:$color-orange;
    transform-origin: 50% 50%;
    
    @extend .propulsed;
  }
  
  .spark-2 {
    position: absolute;
    bottom: 147px;
    z-index: 20;
    left: 52px;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background:$color-orange;
    
    @extend .propulsed;
    animation-delay:0.22s;
  }
  
  .spark-3 {
    position: absolute;
    bottom: 90px;
    z-index: 20;
    left: 109px;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    background:$color-red;
    
    @extend .propulsed;
    animation-delay:0.32s;
  }
  
  .spark-4 {
    position: absolute;
    bottom: 20px;
    left: 83px;
    z-index: 20;
    width: 10px;
    height: 10px;
    background:$color-orange;
    
    @extend .propulsed;
    animation-delay:0.16s;
    
  }
  
  .hyperspace {
    animation: hyperspace 0.4s infinite; 
  }
  
  .star {
    position: absolute;
    width: 4px;
    height: 20px;
    background:#fff;
    z-index: 90;
    @extend .hyperspace;
    &.star--1 {
      left: 50px;
      top: -10px;
      animation-delay:0.10s;
    }
    &.star--2 {
      right: 60px;
      top: 30px;
      animation-delay:0.10s;
    }
    &.star--3 {
      top: 80px;
      left: 25px;
      animation-delay:0.2s;
    }
    &.star--4 {
      top: -20px;
      right: 75px;
      animation-delay:0.2s;
    }
    &.star--5 {
      right: 30px;
      top: -60px;
      animation-delay:0.30s;
    }
    &.star--6 {
      right: 160px;
      top: 50px;
      animation-delay:0.40s;
    }
    &.star--7 {
      top: 20px;
      left: 75px;
      animation-delay:0.3s;
    }
    &.star--8 {
      top: -30px;
      right: 95px;
      animation-delay:0.4s;
    }
    &.star--9 {
      right: 30px;
      top: -60px;
      animation-delay:0.30s;
    }
    &.star--10 {
      right: 160px;
      top: 50px;
      animation-delay:0.40s;
    }
    &.star--11 {
      top: 20px;
      left: 75px;
      animation-delay:0.3s;
    }
    &.star--12 {
      top: -30px;
      right: 95px;
      animation-delay:0.4s;
    }
    
    &.star--13 {
      left: -30px;
      top: -60px;
      animation-delay:0.30s;
    }
    &.star--14 {
      right: -20px;
      top: 50px;
      animation-delay:0.40s;
    }
    &.star--15 {
      top: 20px;
      left: -75px;
      animation-delay:0.3s;
    }
    &.star--16 {
      top: -30px;
      right: -95px;
      animation-delay:0.4s;
    }
  }
  
  @keyframes dancing_fire {
    0%   { 
      transform-origin: 50% 50%;
      transform:translate(0,-10px) scale(1);
      opacity: 1;
    }
    100% { 
      transform:translate(0,50px) scale(1);
      opacity: 0;
    }
  }
  
  @keyframes fire_propulsion {
    0%   { 
      transform:translate(0,-10px) scale(1) rotate(-33deg) skew(0deg, -30deg);
      transform-origin: 50% 50%;
      opacity: 1;
    }
    100% { 
      transform:translate(0,50px) scale(0.7) rotate(-33deg) skew(0deg, -30deg);
      opacity: 0;
    }
  }
  
  @keyframes main_fire {
    0% {
      transform:translate(0,5px) scale(1.1,1) rotate(-33deg) skew(0deg, -30deg);
    }
    100% {
      transform:translate(0,0px) scale(1,1.4) rotate(-33deg) skew(0deg, -30deg);
    }
  }
  
  @keyframes vibration {
    0%   { 
      transform:scale(1) translate(0,0) rotate(45deg);
    }
    50%   { 
      transform:scale(1) translate(1px,-1px) rotate(45deg);
    }
    100% { 
      transform:scale(1) translate(0,0) rotate(45deg);
    }
  }
  
  @keyframes hyperspace {
    0%   { 
      transform:translate(0,-100px) scale(1,0);
      opacity: 1;
    }
    100% { 
      transform:translate(0,400px) scale(1,1);
      opacity: 0;
    }
  }
</style>
