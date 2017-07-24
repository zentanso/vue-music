<template>
  <div>
    <div class="rank-list">
      <square-pic-item 
        v-for="item in topLists" 
        :key="item.id" 
        size="33vw" 
        :pic="item.coverImgUrl+'?param=200y200'" 
        :desc="item.name"
        @click.native="onItemClick(item.id)"
      >
        <span slot="bottom-left">{{item.updateFrequency}}</span>
      </square-pic-item>
      <Loading-msg
        :isLoading="loadingRank"
        :isError="loadRankError"
        :reloadFunc="_getTopList"
      >
      </Loading-msg>
    </div>
  </div>
</template>

<script>
import SquarePicItem from '@/components/SquarePicItem'
import { LOADING, ERROR, LOADED } from '@/constants'
import LoadingMsg from '../common/LoadingMsg'

import { getTopList } from '@/api'
export default {
  name: 'rank',
  data () {
    return {
      topLists: [],
      loadState: {
        rank: LOADED
      }
    }
  },
  components: {
    SquarePicItem,
    LoadingMsg
  },
  computed: {
    loadingRank () {
      return this.loadState.rank === LOADING
    },
    loadRankError () {
      return this.loadState.rank === ERROR
    }
  },
  mounted () {
    this._getTopList()
  },
  methods: {
    async _getTopList () {
      this.loadState.rank = LOADING
      const result = await getTopList()
      if (!result) {
        this.loadState.rank = ERROR
        return
      }
      this.topLists = result.data.list
      this.loadState.rank = LOADED
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
</style>
