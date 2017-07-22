<template>
  <div style="width: 100%;">
    <m-loading v-show="isLoading" :msg="loadingMsg"></m-loading>
    <load-error v-show="isError" :msg="errorMsg" @click.native.stop="reloadFunc"></load-error>
  </div>
</template>

<script>
import LoadError from '@/components/LoadError'
import MLoading from '@/components/MLoading'

export default {
  name: 'loading-msg',
  components: {
    LoadError,
    MLoading
  },
  props: {
    isLoading: {
      type: Boolean
    },
    isError: {
      type: Boolean
    },
    reloadFunc: {
      type: Function
    },
    loadingMsg: {
      type: String,
      default: '努力加载中(￣3￣)'
    },
    errorMsg: {
      type: String,
      default: '加载失败，点击重试_(:3」∠)_'
    }
  }
}
</script>

<style>
  
</style>
