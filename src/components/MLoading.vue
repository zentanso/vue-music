<template>
  <div class="loadmore-con" :style="{visibility: show ? 'visible' : 'hidden'}">
    <div class="loadmore-icon">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <span class="loadmore-tip">{{tip}}</span>
  </div>
</template>

<script>
export default {
  name: 'mload-more',
  props: {
    'show': {
      default: true,
      type: Boolean
    },
    'tip': {
      default: '加载中',
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/theme';

.loadmore-con {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.loadmore-icon {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 14px;
}

.bar {
  margin-left: 2px;
  width: 2px;
  height: 100%;
  background-color: @theme-color;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-iteration-count: infinite;
  &:first-child {
    animation-name: bar1;
  }
  &:nth-child(2) {
    animation-name: bar2;
  }
  &:nth-child(3) {
    animation-name: bar3;
  }
  &:nth-child(4) {
    animation-name: bar4;
  }
}

.loadmore-tip {
  font-size: 12px;
  margin-left: 5px;
}


</style>
