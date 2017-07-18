<template>
  <div v-if="show" class="error-text">{{msg}}</div>
</template>

<script>
export default {
  name: 'load-error',
  props: {
    msg: {
      default: '加载失败',
      type: String
    },
    show: {
      default: true,
      type: Boolean
    },
    callback: {
      default: function () {
        console.log('trying')
      },
      type: Function
    }
  }
}
</script>

<style lang="less" scoped>
.error-text {
  width: 100%;
  margin: 3rem 0 3rem 0;
  text-align: center;
  font-size: 16px;
  color: grey;  
}
</style>
