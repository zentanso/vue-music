<template>
  <div>
    <div class="rank-list">
      <square-pic-item 
        v-for="item in topLists" 
        :key="item.id" 
        size="5.2rem" 
        :pic="item.coverImgUrl+'?params=200y200'" 
        :desc="item.name"
        @click.native="onItemClick(item.id)"
      >
        <span slot="bottom-left">{{item.updateFrequency}}</span>
      </square-pic-item>
      <m-loading v-if="loading === LOADING"></m-loading>
      <load-error v-if="loading === ERROR"></load-error>
    </div>
  </div>
</template>

<script>
import SquarePicItem from '@/components/SquarePicItem'
import MLoading from '@/components/MLoading'
import LoadError from '@/components/LoadError'
import { LOADING, ERROR, LOADED } from '@/constants'

import { getTopList } from '@/api'
export default {
  name: 'rank',
  data () {
    return {
      topLists: [],
      loading: LOADED,
      LOADING,
      LOADED,
      ERROR
    }
  },
  components: {
    SquarePicItem,
    MLoading,
    LoadError
  },
  mounted () {
    this._getTopList()
  },
  methods: {
    async _getTopList () {
      this.loading = LOADING
      const result = await getTopList()
      if (!result) {
        this.loading = ERROR
        return
      }
      this.topLists = result.data.list
      this.loading = LOADED
    },
    onItemClick (id) {
      this.$router.push(`/playlistdetail/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.rank-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.list-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
