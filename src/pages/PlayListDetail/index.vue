<template>
  <div>
    <x-header class="header-wrapper">
      {{isRecommend ? '每日歌曲推荐' : '歌单'}}
      <x-icon slot="overwrite-left" type="android-arrow-back" class="topbar-icon" @click="onBackClick"></x-icon>
    </x-header>
    <div class="wrapper">
      <div class="playlist-header">
        <div class="pic-desc" v-if="!isRecommend">
          <square-pic-item size="5rem" :pic="detail.coverImgUrl + '?params=300y300'"></square-pic-item>
          <div class="desc">
            <div class="playlist-name">{{detail.name}}</div>
            <router-link :to="`/user/${detail.creator && detail.creator.userId}`" :style="{color: '#fff'}">
              <div class="playlist-author">{{detail.creator && detail.creator.nickname}}</div>
            </router-link>  
          </div>
        </div>
        <div v-else class="recommend-header">
          每日推荐
        </div>
      </div>
      <list-item class="playlist-control" @click.native="playAll">
        <span slot="left" class="play-all-btn">
          <x-icon slot="right" type="ios-play" class="list-icon"></x-icon>                
        </span>
        <div class="play-all-txt" slot="title">
          播放全部
          <span>{{`(共${isRecommend ? detail.tracks && detail.tracks.length : (detail.trackCount || 0)}首)`}}</span>
        </div>
      </list-item>
      <template v-if="loadingState.detail !== LOADING">
        <list-item @click.native="onTrackClick(index, item.id)" :key="item.id" class="playlist-item" v-for="(item, index) in detail.tracks">
          <span class="order-num" slot="left">{{index+1}}</span>      
          <h3 class="track-name" slot="title">
            {{item.name}}
            <span class="desc"></span>
          </h3>
           <p class="track-singer" slot='subtitle'>
            {{isRecommend ? 
            `${item.artists && item.artists[0].name} - ${item.album.name}` : 
            `${item.ar && item.ar[0].name} - ${item.al.name}`
            }}
          </p> 
          <x-icon slot="right" type="android-more-vertical" class="list-icon"></x-icon>      
        </list-item>
      </template>
      <m-loading v-if="loadingState.detail === LOADING" tip="努力加载中"></m-loading>
      <load-error @click.native="getListDetail" v-if="loadingState.detail === ERROR" msg="加载失败，点击重新加载"></load-error>
      <mini-player-bar @on-list-click="showDrawer"></mini-player-bar>
      <play-list-drawer v-model="drawerState"></play-list-drawer>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import ListItem from '@/components/ListItem'
import SquarePicItem from '@/components/SquarePicItem'
import MLoading from '@/components/MLoading'
import LoadError from '@/components/LoadError'
import MiniPlayerBar from '@/components/MiniPlayerBar'
import PlayListDrawer from '@/components/PlayListDrawer'
import { LOADING, LOADED, ERROR } from '@/constants'
import { mapActions, mapState } from 'vuex'
import { getPlayListDetail, getRecommendSongs } from '@/api'

export default {
  name: 'playlistdetail',
  components: {
    XHeader,
    ListItem,
    SquarePicItem,
    MLoading,
    MiniPlayerBar,
    PlayListDrawer,
    LoadError
  },
  data () {
    return {
      detail: {},
      loadingState: {
        detail: LOADED
      },
      lastId: -1,
      LOADING,
      LOADED,
      ERROR,
      drawerState: false
    }
  },
  async activated () {
    if (this.lastId === this.$route.params.id) return
    this.detail = {}
    this.lastId = this.$route.params.id
    if (this.isRecommend) {
      await this._getRecommendSongs()
    } else {
      await this.getListDetail()
    }
  },
  computed: {
    ...mapState([
      'isFM'
    ]),
    isRecommend () {
      return this.$route.params.id === 'recommend'
    }
  },
  methods: {
    ...mapActions([
      'addTrack',
      'setTrackUrl',
      'clearPlayList',
      'toTrack',
      'setIsFM'
    ]),
    async playAll () {
      if (this.isFM) this.setIsFM(false)

      if (!this.detail.trackCount) {
        console.log('no songs here')
        return
      }
      let {tracks} = this.detail

      const $this = this
      this.clearPlayList()
      tracks.forEach(item => {
        $this.addTrack(item)
      })
    },
    onBackClick () {
      window.history.go(-1)
    },
    async _getRecommendSongs () {
      this.loadingState.detail = LOADING
      const detail = await getRecommendSongs()
      if (!detail) {
        console.log('get list detail')
        this.loadingState.detail = ERROR
        return
      }
      this.detail.tracks = detail.data.recommend
      this.detail.trackCount = detail.data.recommend.length
      this.loadingState.detail = LOADED
    },
    async getListDetail () {
      this.loadingState.detail = LOADING
      const detail = await getPlayListDetail(this.$route.params.id)
      if (!detail) {
        console.log('get list detail')
        this.loadingState.detail = ERROR
        return
      }
      this.detail = detail.data.playlist
      this.loadingState.detail = LOADED
    },
    onTrackClick (index, id) {
      if (this.isFM) {
        this.setIsFM(false)
        this.clearPlayList()
      }

      const track = this.detail.tracks[index]
      if (this.isRecommend) {
        this.addTrack({
          id: track.id,
          album: track.album,
          name: track.name,
          artists: track.artists
        })
      } else {
        this.addTrack({
          id: track.id,
          album: track.al,
          name: track.name,
          artists: track.ar
        })
      }
      this.toTrack(track.id)
    },
    showDrawer () {
      this.drawerState = true
    },
    hideDrawer () {
      this.drawerState = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme';
@import '../../styles/mixins';

.header-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 499;
}

.playlist-header {
  box-sizing: border-box;
  color: #fff;
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(120deg, #3e3838, #8f8db5);
}

.desc {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 0.4rem;
}

.playlist-name {
  margin-bottom: 0.8rem;
  font-size: 18px;
}

.playlist-author {
  font-size: 12px;
}

.pic-desc {
  display: flex;
}

.wrapper {
  margin-top: 46px;
  padding-bottom: 3rem;
}

.order-num {
  font-size: 16px;
  color: grey;
}

.track-name {
  font-weight: normal;
  font-size: 16px;
  word-break: break-all;
  .desc {
    color: grey;
  }
  &.playing {
    color: @theme-color;
  }
}

.track-singer {
  font-size: 12px;
  color: grey;
}

.list-icon {
  fill: grey;
}

.playlist-item {
  border-bottom: 1px solid @light-grey;
  padding: 0.2rem 0 0.2rem 0;
  background-color: #fff;  
  &:hover,
  &:active {
    background-color: @light-grey;
  }
  &:link,
  &:visited {
    background-color: #fff;
  }
}

.playlist-control {
  cursor: pointer;
  padding: 10px 0 10px 0;
  border-bottom: 1px solid @light-grey;
}

.play-all-btn {
  .circle-btn(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
}

.play-all-txt {
  font-size: 16px;
  margin: 5px 0 5px 0;
  > span {
    font-size: 12px;
    color: grey;
  }
}
</style>
