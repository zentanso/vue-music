<template>
  <div :style="{width: size}">
    <div class="item" :style="{height: size}">
      <div>
        <slot name="top-left"></slot>
      </div>
      <div>
        <slot name="top-right"></slot>
      </div>
      <div>
        <slot name="bottom-left"></slot>
      </div>
      <div>
        <slot name="bottom-right"></slot>
      </div>
      <img v-lazy="pic" alt="" class="bg-img">
    </div>
    <p class="desc">{{ desc }}</p>
  </div>
</template>

<script>
export default {
  name: 'square-pic-item',
  props: {
    pic: {
      default: ''
    },
    url: {
      default: ''
    },
    desc: {
      default: ''
    },
    size: {
      default: '2rem'
    }
  }
}
</script>

<style lang="less" scope>
@import '../styles/mixins';
@pad: 0.1rem;

.item {
  position: relative;
  background-color: #c2c2c4;
  font-size: 12px;
  color: #fff;
  > div {
    position: absolute;
  }
  > div:first-child {
    top: @pad;
    left: @pad;
  }
  > div:nth-child(2) {
    top: @pad;
    right: @pad;
  }
  > div:nth-child(3) {
    bottom: @pad;
    left: @pad;
  }
  > div:last-child {
    bottom: @pad;
    right: @pad;
  }
}

.desc {
  padding: 0.2rem;
  font-size: 12px;
}

.bg-img {
  display: block;
  .square(100%);
}

img[lazy=loaded] {
  animation: fadeIn .1s ease;
}

@keyframes fadeIn {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }

}
</style>
