<template>
  <div class="track-detail-con">
    <x-header class="header-class">
      {{currentTrack && currentTrack.name}}
      <x-icon @click="goBack" slot="overwrite-left" type="android-arrow-back" class="topbar-icon"></x-icon>
    </x-header>
    <div :style="{visibility: !lyricState ? 'visible' : 'hidden'}">
      <img  src="@/../static/img/tonearm.png" alt="" :class="['tonearm' , playing ? 'playing' : '']">
      <div class="disk" @click="showLyric">
        <img :src="currentPic" alt="" :class="['disk-img', playing ? 'playing' : '']">
      </div>
      <div class="custom-bar">
        <div class="custom-bar-btn" @click="_likeTrack" v-if="!isLiked">
          <x-icon type="ios-heart-outline" size="30" class="custom-bar-icon"></x-icon>
        </div>
        <div class="custom-bar-btn" @click="_dislikeTrack" v-if="isLiked">
          <x-icon type="ios-heart" :style="{fill: '#e83c3c'}" size="30" class="custom-bar-icon"></x-icon>
        </div>
        <a :href="currentTrack && currentTrack.url" target="_blank">
          <div class="custom-bar-btn">
            <x-icon type="android-download" size="30" class="custom-bar-icon"></x-icon>
          </div>
        </a>
         <router-link :to="`/comments?type=track&id=${currentTrack && currentTrack.id}`">
          <div class="custom-bar-btn">
            <x-icon type="ios-chatboxes-outline" size="30" class="custom-bar-icon"></x-icon>
          </div>
        </router-link> 
        <div v-if="!isFM" class="custom-bar-btn" @click="showDrawer">
          <x-icon type="ios-more" size="30" class="custom-bar-icon"></x-icon>
        </div>
      </div>
    </div>
    <div class="progress-con">
      <div class="time">{{currentTime | getPlayerTime}}</div>
      <div 
        class="progress-bar" 
        ref="progressBar" 
        @touchstart="ontouchstart" 
        @touchmove="ontouchmove" 
        @touchend="onmoveend"
        @mousedown="onmousedown"
        @mouseup="onmoveend"
      >
        <span class="progress-dot" :style="{left: progressBarPercent + '%'}">
          <span></span>
        </span>
        <span class="progress-listened-bar" :style="{width: progressBarPercent + '%'}"></span>
        <span class="progress-cached-bar"></span>
      </div>
      <div class="time">{{duration | getPlayerTime}}</div>
    </div>
    <div class="control-bar">
      <div v-if="isFM" class="control-bar-btn" @click="_fmTrash">
        <x-icon type="trash-a" size="26" class="player-icon"></x-icon>
      </div>
       <div v-if="!isFM" class="control-bar-btn" @click="previousTrack">
        <x-icon type="ios-skipbackward" size="26" class="player-icon"></x-icon>
      </div> 
      <div v-show="loadingUrl" class="control-bar-btn loading big">
        <x-icon type="load-c" size="30" class="player-icon"></x-icon>
      </div>
      <div v-show="loadUrlError" class="control-bar-btn big" @click="reloadUrl">
        <x-icon type="android-refresh" size="30" class="player-icon"></x-icon>
      </div>
      <div v-show="!playing && loadedUrl" class="control-bar-btn big" @click="control">
        <x-icon type="ios-play" size="30" class="player-icon"></x-icon>
      </div>
      <div v-show="playing && loadedUrl" class="control-bar-btn big" @click="control">
        <x-icon type="ios-pause" size="30" class="player-icon"></x-icon>
      </div>
      <div class="control-bar-btn" @click="nextTrack">
        <x-icon type="ios-skipforward" size="26" class="player-icon"></x-icon>
      </div>
    </div>
    <lyric :style="{visibility: lyricState ? 'visible' : 'hidden'}" class="lyric" @click.native="hideLyric"></lyric>
    <play-list-drawer v-model="drawerState"></play-list-drawer>
    <loading v-model="showFMLoading" text="FM歌曲加载中"></loading>
  </div>
</template>

<script>
import { XHeader, Loading } from 'vux'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { getPlayerTime } from '@/filters'
import { LOADING, LOADED, ERROR } from '@/constants'
import { getPersonalFM, likeTrack, fmTrash } from '@/api'
import PlayListDrawer from '@/components/PlayListDrawer'
import Lyric from './Lyric'

export default {
  data () {
    return {
      progressBar: null,
      touching: false,
      touchPercent: 0,
      drawerState: false,
      lyricState: false,
      loadState: {
        fm: LOADED,
        like: -1,
        dislike: -1,
        trash: LOADED
      }
    }
  },
  filters: {
    getPlayerTime
  },
  computed: {
    ...mapState([
      'currentTime',
      'duration',
      'playing',
      'currentIndex',
      'playlist',
      'isFM',
      'likedList',
      'userid'
    ]),
    ...mapGetters([
      'currentTrack',
      'urlState'
    ]),
    progressBarPercent () {
      if (this.touching) {
        return this.touchPercent
      } else {
        if (this.duration) {
          return parseInt(100 * (this.currentTime / this.duration))
        }
        return 0
      }
    },
    currentPic () {
      return this.currentTrack && this.currentTrack.album.picUrl + '?param=140y140'
    },
    loadingUrl () {
      return this.urlState === LOADING
    },
    loadUrlError () {
      return this.urlState === ERROR
    },
    loadedUrl () {
      return this.urlState === LOADED
    },
    isLiked () {
      if (this.loadState.like === LOADED) {
        return true
      } else if (this.loadState.dislike === LOADED) {
        return false
      } else {
        if (this.currentTrack) {
          return this.likedList.indexOf(this.currentTrack.id) >= 0
        } else {
          return false
        }
      }
    },
    loadingFM () {
      return this.loadState.fm === LOADING
    },
    showFMLoading () {
      return !this.currentTrack && this.loadingFM
    }
  },
  mounted () {
    this.progressBar = this.$refs.progressBar
  },
  async activated () {
    const type = this.$route.query.type
    if (type === 'FM' && !this.isFM) {
      this.setIsFM(true)
      this.clearPlayList()
      await this._getPersonalFM()
    }
    if (!type && this.isFM) {
      this.setIsFM(false)
    }
  },
  components: {
    XHeader,
    PlayListDrawer,
    Lyric,
    Loading
  },
  methods: {
    ...mapActions([
      'control',
      'addTrack',
      'setJumping',
      'updateCurrentTime',
      'nextTrack',
      'previousTrack',
      'setTrackUrl',
      'clearPlayList',
      'setIsFM',
      'playlist',
      'deleteTrack',
      'getLikedList'
    ]),
    ...mapMutations([
      'SET_URL_STATE'
    ]),
    goBack () {
      window.history.go(-1)
    },
    // 跟踪手指相对进度条的位置
    tracePercent (x) {
      const length = this.progressBar.clientWidth
      const barLeft = this.progressBar.getBoundingClientRect().left
      let percent = (x - barLeft) * 100 / length

      if (percent < 0) {
        percent = 0
      } else if (percent > 100) {
        percent = 100
      }
      this.touchPercent = percent
    },
    onmousedown (e) {
      this.touching = true
      this.tracePercent(e.pageX)
    },
    ontouchstart (e) {
      this.touching = true
      this.tracePercent(e.targetTouches[0].pageX)
    },
    ontouchmove (e) {
      this.tracePercent(e.targetTouches[0].pageX)
    },
    onmoveend (e) {
      const $this = this
      const currentTime = this.duration * this.touchPercent / 100
      this.setJumping(true)
      this.updateCurrentTime(currentTime)
      // 防止进度条抖动
      setTimeout(() => {
        $this.touching = false
      }, 500)
    },
    showDrawer () {
      this.drawerState = true
    },
    showLyric () {
      this.lyricState = true
    },
    hideLyric () {
      this.lyricState = false
    },
    async reloadUrl () {
      this.SET_URL_STATE({
        state: LOADING
      })
      const result = await this.setTrackUrl(this.currentTrack.id)
      if (!result) {
        this.SET_URL_STATE({
          state: ERROR
        })
      } else {
        this.SET_URL_STATE({
          state: LOADED
        })
      }
    },
    async _getPersonalFM () {
      this.loadState.fm = LOADING
      let ret = await getPersonalFM()
      if (!ret) {
        this.loadState.fm = ERROR
      }

      // 每次获取fm歌曲时清除本歌曲之前的歌曲
      if (this.currentIndex && (this.currentIndex === this.playlist.length - 1)) {
        let index = this.currentIndex
        for (let i = 0; i < index; i++) {
          this.deleteTrack(this.playlist[0].id)
        }
      }

      ret = ret.data.data
      const $this = this
      ret.forEach(item => {
        $this.addTrack({
          name: item.name,
          album: item.album,
          artists: item.artists,
          id: item.id
        })
      })

      this.loadState.fm = LOADED
    },
    // 由于更新用户喜欢列表过慢，如果红心仅仅依赖于列表会让操作看起来非常慢
    // 所以内置一个like和dislike状态以表示喜欢/取消喜欢异步操作状态
    async _likeTrack () {
      if (!this.userid) {
        this.$router.push('/login')
        return
      }
      this.loadState.dislike = -1
      this.loadState.like = LOADING
      const ret = await likeTrack(this.currentTrack.id)
      if (!ret) {
        this.loadState.like = ERROR
        return
      }
      if (Number(ret.code) !== 200) {
        this.loadState.like = ERROR
        console.log(ret.code)
      }
      this.loadState.like = LOADED
      await this.getLikedList()
    },
    async _dislikeTrack () {
      if (!this.userid) {
        this.$router.push('/login')
        return
      }
      this.loadState.like = -1
      this.loadState.dislike = LOADING
      const ret = await likeTrack(this.currentTrack.id, false)
      if (!ret) {
        this.loadState.dislike = ERROR
        return
      }
      if (Number(ret.code) !== 200) {
        this.loadState.dislike = ERROR
        console.log(ret.code)
      }
      this.loadState.dislike = LOADED
      await this.getLikedList()
    },
    async _fmTrash () {
      this.loadState.trash = LOADING
      const id = this.currentTrack.id
      this.nextTrack()
      const ret = await fmTrash(id)
      if (!ret) {
        this.loadState.fmTrash = ERROR
        return
      }
      if (Number(ret.code) !== 200) {
        this.loadState.fmTrash = ERROR
        console.log(ret.code)
      }
      this.loadState.fmTrash = LOADED
    }
  },
  watch: {
    async currentIndex () {
      if (
        this.isFM &&
        this.currentIndex &&
        (this.currentIndex === this.playlist.length - 1)
      ) {
        console.log('fm')
        await this._getPersonalFM()
      }
    },
    currentTrack () {
      // 每次切歌初始化喜欢状态
      this.loadState.like = -1
      this.loadState.dislike = -1
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme.less';
@import '../../styles/mixins.less';

.header-class {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 499;
}

.custom-bar {
  position: fixed;
  width: 100%;
  bottom: 6rem;
  left: 50%;
  margin-left: -50%;
  display: flex;
  justify-content: space-around;
}

.custom-bar-btn {
  .circle(2rem);
  .f-all-center();
  border: 1px solid @light-grey;
  &:active {
    background-color: #f6f8fe;
  }
}

.custom-bar-icon {
  fill: #000;
}

.progress-con {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 4rem;
  width: 100%;
  height: 1rem;
  padding: 0 0.5rem 0 0.5rem;
  .f-vertical-center();
  justify-content: space-between;
  .time {
    font-size: 0.5rem;
    padding: 0.1rem;
  }
}

.progress-bar {
  position: relative;
  flex: 1;
  margin: 0 4px 0 4px;
  background-color: @light-grey;
  height: 4px;
  border-radius: 2px;
}

.progress-dot {
  position: absolute;
  top: -4px;
  transform: translateX(-4px);
  .circle(10px);
  .f-all-center();
  background-color: #fff;
  border: 1px solid @light-grey;
  z-index: 3;
  span {
    .circle(4px);
    background-color: @theme-color;
  } 
}

.progress-listened-bar,
.progress-cached-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.2rem;
  border-radius: 0.1rem;
}

.progress-cached-bar {
  background-color: #c2c2c4;
  z-index: 1;
}

.progress-listened-bar {
  background-color: @theme-color;
  z-index: 2;
}

.control-bar {
  position: fixed;
  width: 100%;
  left: 50%;
  bottom: 1rem;
  margin-left: -50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.control-bar-btn {
  .f-all-center();
  background-color: @theme-color;
  .circle(40px);
  animation: circling 1s linear infinite;
  animation-play-state: paused;
  &.big {
    .circle(48px);
  }
  &:active {
    background-color: @theme-active-color;
  }
  &.loading {
    animation-play-state: running; 
  }
}

.track-detail-con {
  height: 100vh;
}

.lyric {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 7rem;
}

.tonearm {
  position: fixed;
  margin: -0.6rem 0 0 -0.6rem;
  top: 46px;
  left: 50%;
  width: 4rem;
  height: 6rem;
  transform-origin: 0.6rem 0.6rem;  
  transform: rotate(-30deg);
  transition: transform .3s linear;
  z-index: 2;
  &.playing {
    transform: rotate(-5deg)
  }
}

.disk {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 4.5rem;
  left: 50%;
  margin-left: -5rem;
  .circle(10rem);
  background: url('../../../static/img/disk.png') no-repeat center;
  background-size: 100%;
  z-index: 1;
}

.disk-img {
  .circle(6rem);
  animation: circling 10s infinite linear;
  animation-play-state: paused; 
  &.playing {
    animation-play-state: running; 
  }
}

</style>
