<template>
  <div>
    <button-tab v-model="tabIndex" class="button-tab">
      <button-tab-item v-for="item in typeArr" :key="item">
        {{item}}
      </button-tab-item>
    </button-tab>
    <div 
      class="list-container" 
      v-infinite-scroll="loadMore" 
      infinite-scroll-disabled="loadDisabled" 
      infinite-scroll-distance="200"
    >
      <router-link  v-for="item in playlist" :key="item.id" :to="`/playlistdetail/${item.id}`">
        <square-pic-item :size="picSize" :desc="item.name" :pic="item.coverImgUrl">
        </square-pic-item>
      </router-link>
      <loading-msg
        :isLoading="loadingPlayList"
        :isError="loadPlayListError"
        :reloadFunc="loadMore"
      >
      </loading-msg>
      <div v-if="nomore" class="nomore">没有更多了>_<</div>
    </div>
  </div>
</template>

<script>
import { getPlayList } from '@/api'
import { LOADING, LOADED, ERROR, END } from '@/constants'
import SquarePicItem from '@/components/SquarePicItem'
import LoadingMsg from '../common/LoadingMsg'
import { ButtonTab, ButtonTabItem } from 'vux'

export default {
  name: 'play-list',
  data () {
    return {
      playlist: [],
      loadState: {
        playlist: LOADED
      },
      limit: 10,
      page: 0,
      picSize: '7.9rem',
      end: false,
      leaving: false,
      tabIndex: 0,
      typeArr: ['华语', '欧美', '电子']
    }
  },
  watch: {
    async type () {
      this.initPlayList()
      await this.loadMore()
    }
  },
  computed: {
    type () {
      return this.typeArr[this.tabIndex]
    },
    loadDisabled () {
      return this.loadState.playlist === LOADING || this.loadState.playlist === ERROR
    },
    nomore () {
      return this.loadState.playlist === END
    },
    offset () {
      return this.page * this.limit
    },
    loadingPlayList () {
      return this.loadState.playlist === LOADING
    },
    loadPlayListError () {
      return this.loadState.playlist === ERROR
    }
  },
  components: {
    LoadingMsg,
    SquarePicItem,
    ButtonTab,
    ButtonTabItem
  },
  deactivated () {
    this.leaving = true
  },
  activated () {
    this.leaving = false
  },
  async mounted () {
    await this.loadMore()
  },
  methods: {
    initPlayList () {
      this.page = 0
      this.playlist = []
    },
    async loadMore () {
      if (this.nomore || this.leaving) return

      const list = await this._getPlayList(this.limit, this.type, this.offset)

      if (!list) return

      if (list.length < this.limit) {
        this.loadState.playlist = END
      }

      this.page++
    },
    async _getPlayList (limit, type, offset) {
      this.loadState.playlist = LOADING

      let list = await getPlayList(limit, type, offset)
      if (!list) {
        this.loadState.playlist = ERROR
        return
      }

      list = list.data.playlists

      // 检查类型符合
      if (type !== this.type) return

      // 检查是否同一内容重复请求
      const {id} = list[0]
      let duplicated = false
      this.playlist.forEach((item) => {
        if (item.id === id) {
          duplicated = true
        }
      })
      if (duplicated) {
        return false
      }

      list = list.map(({coverImgUrl, name, playCount, id}) => {
        return {
          coverImgUrl: coverImgUrl + '?param=200y200',
          name,
          playCount,
          id
        }
      })

      this.playlist = this.playlist.concat(list)
      this.loadState.playlist = LOADED
      return list
    }
  }
}
</script>

<style lang="less" scoped>

.list-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}  

.nomore {
  margin: 2rem 0 2rem 0;
  width: 100%;
  font-size: 14px;
  color: grey;
  text-align: center;
}

.button-tab {
  padding: 1rem 0.2rem 1rem 0.2rem;
}
</style>
