<template>
  <a class="list-item" href="javascript:void(0);">
    <div v-if="left" class="left">
      <slot name="left"></slot>
    </div>
    <div class="content">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="subtitle">
        <slot name="subtitle"></slot>
      </div>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </a>
</template>

<script>
export default {
  name: 'list-item',
  props: {
    left: {
      default: true,
      type: Boolean
    }
  }
}
</script>

<style lang="less" scoped>
  .list-item {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .list-item:active {
    background-color: @light-grey;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }
  .title {
    font-size: 14px;
  }
  .subtitle {
    font-size: 10px;
  }
  .left,
  .right {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }    
</style>
