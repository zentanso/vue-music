<template>
  <div>
    <x-header class="header-wrapper" :style="{backgroundColor: `rgba(232, 60, 60, ${opacity})`}">
      用户信息
      <x-icon slot="overwrite-left" type="android-arrow-back" class="topbar-icon" @click="onBackClick"></x-icon>
    </x-header>
    <div class="user-wrapper" :style="{backgroundImage: `url(${profile.backgroundUrl+'?param=300y300'}`}">
      <span class="avatar":style="{backgroundImage: `url(${profile.avatarUrl+'?param=100y100'})`}"></span>
      <span class="name">{{profile.nickname || '加载中'}}</span>
      <p>
        <span class="follows">关注{{profile.follows || 0}}</span>
        |
        <span class="followed">粉丝{{profile.followed || 0}}</span>
      </p>
    </div>
    <tab>
      <tab-item selected>音乐</tab-item>
      <tab-item>关于TA</tab-item>
    </tab>
    <div 
      class="tab-content"
      ref="tabCon"
    >
      <router-link :to="`/playlistdetail/${item.id}`" :key="item.id" v-for="item in playlist">
        <div class="play-list-item">
          <span class="cover" :style="{backgroundImage: `url(${item.coverImgUrl+'?param=40y40'})`}"></span>
          <div>
            <p class="title">{{item.name}}</p>
            <p class="desc">{{`${item.trackCount}首，播放${getListenNum(item.playCount)}次`}}</p>
          </div>
        </div>
      </router-link>
      <loading-msg
        :isLoading="loadingPlayList"
        :isError="loadPlayListError"
        :reloadFunc="_getUserPlayList"
      >
      </loading-msg>
    </div>
  </div>
</template>

<script>
import {
  getUserDetail,
  getUserPlayList,
  getUserRecord
} from '@/api'
import { LOADING, LOADED, ERROR } from '@/constants'
import { XHeader, Tab, TabItem } from 'vux'
import { getListenNum } from '@/filters'
import LoadingMsg from '../common/LoadingMsg'

export default {
  name: 'user',
  data () {
    return {
      loadState: {
        detail: LOADED,
        playlist: LOADED,
        record: LOADED
      },
      lastId: -1,
      detail: {},
      record: {},
      playlist: [],
      opacity: 0
    }
  },
  components: {
    XHeader,
    Tab,
    TabItem,
    LoadingMsg
  },
  computed: {
    profile () {
      return this.detail.profile || {}
    },
    loadingPlayList () {
      return this.loadState.playlist === LOADING
    },
    loadPlayListError () {
      return this.loadState.playlist === ERROR
    }
  },
  beforeRouteEnter (to, from, next) {
    const {id} = to.params
    if (!id) next(false)
    next()
  },
  async activated () {
    const {id} = this.$route.params
    if (this.lastId === id) return
    this.detail = {}
    this.playlist = []
    this.lastId = id
    await Promise.all([
      this._getUserDetail(id),
      // this._getUserRecord(id),
      this._getUserPlayList(id)
    ])
  },
  mounted () {
    this.bind()
  },
  methods: {
    test () {
      console.log('load more')
    },
    getListenNum,
    async _getUserDetail (id) {
      this.loadState.detail = LOADING
      const ret = await getUserDetail(id)
      if (!ret) {
        this.loadState.detail = ERROR
        return
      }

      this.detail = ret.data
      this.loadState.detail = LOADED
    },
    async _getUserRecord (id) {
      this.loadState.record = LOADING
      const ret = await getUserRecord(id)
      if (!ret) {
        this.loadState.record = ERROR
        return
      }
      this.record = ret.data.allData
      this.loadState.record = LOADED
    },
    async _getUserPlayList (id) {
      this.loadState.playlist = LOADING
      const ret = await getUserPlayList(id)
      if (!ret) {
        this.loadState.playlist = ERROR
        return
      }

      this.playlist = ret.data.playlist
      this.loadState.playlist = LOADED
    },
    onBackClick () {
      window.history.go(-1)
    },
    bind () {
      window.addEventListener('scroll', this.headerTranspareny.bind(this))
      window.addEventListener('scroll', this.handleList.bind(this))
    },
    headerTranspareny () {
      const scrollTop = document.body.scrollTop
      const opacity = scrollTop / 200
      this.opacity = opacity
    },
    handleList () {
      const scrollTop = document.body.scrollTop
      if (scrollTop >= 204) {
        this.$refs.tabCon.style.overflow = 'scroll'
      } else {
        this.$refs.tabCon.style.overflow = 'hidden'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixins';
.header-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 499;
}

.user-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  height: 250px;
  font-size: 14px;
  background-size: cover;
  background-color: #000;
  .avatar {
    .circle(80px);
    background-size: cover;
  }
  .name {
    padding-top: 10px;
  }
  .follows,
  .followed {
    padding: 10px;
    font-size: 10px;
  }
}

.tab-content {
  box-sizing: border-box;
  margin-top: -90px;
  padding-top: 90px;
  height: 100vh;
  overflow: hidden;
}

.play-list-item {
  display: flex;
  padding: 10px;
  .cover {
    .square(40px);
    margin-right: 10px;
    background-size: cover;
  }
  .title {
    font-size: 14px;
    line-height: 1.5;
  }
  .desc {
    font-size: 10px;    
    color: grey
  }
}
</style>
