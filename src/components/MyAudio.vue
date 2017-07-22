<template>
  <div>
    <audio
      ref="player"
      controls
      autoplay
      style="display: none"
      @play="onplay"
      @pause="onpause"
      @ended="onended"
      @timeupdate="ontimeupdate"
      @loadedmetadata="onloadedmetadata"
      @durationchange="ondurationchange"
    >
      <source ref="source" v-if="playlist.length" :src="url" @error="onerror">
    </audio>
    <toast :time="1000" v-model="showError" position="bottom" :text="msg" type="text"></toast>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { Toast } from 'vux'
import { LOADING, LOADED, ERROR } from '@/constants'
// const NETWORK_EMPTY = 0 // - 音频/视频尚未初始化
// const NETWORK_IDLE = 1 //- 音频/视频是活动的且已选取资源，但并未使用网络
// const NETWORK_LOADING = 2 //- 浏览器正在下载数据
const NETWORK_NO_SOURCE = 3 // - 未找到音频/视频来源

export default {
  name: 'my-audio',
  data () {
    return {
      player: null,
      url: '',
      msg: '',
      lastId: -1,
      showError: false
    }
  },
  components: {
    Toast
  },
  mounted () {
    this.player = this.$refs.player
  },
  computed: {
    ...mapState([
      'playing',
      'playlist',
      'currentIndex',
      'duration',
      'currentTime',
      'jumping'
    ]),
    ...mapGetters([
      'currentTrack',
      'currentLyric'
    ]),
    match () {
      return this.$refs.source.src
    }
  },
  watch: {
    url () {
      const $this = this
      // uc，qq等浏览器在变更url后立刻进行load无效，故而进行异步延时操作
      setTimeout(() => {
        $this.player.load()
      }, 0)
    },
    async currentTrack () {
      // 播放列表被清空，初始化状态
      if (!this.currentTrack) {
        this.url = ''
        this.lastId = -1
        this.player.load()
        this.pause()
      }
      if (this.currentTrack.id === this.lastId) return
      this.lastId = this.currentTrack.id
      // 利用promise.all并行发起请求
      await Promise.all([this.setLyric(), this.setUrl()])
    },
    // 将播放器状态和state状态绑定
    playing () {
      if (this.playing && this.player.networkState === NETWORK_NO_SOURCE) {
        this.msg = '找不到播放源'
        this.showError = true
        this.pause()
        return
      }

      if (this.playing) {
        this.player.play()
      } else {
        this.player.pause()
      }
    }
  },
  methods: {
    ...mapActions([
      'play',
      'pause',
      'control',
      'setPlayer',
      'setLoadingUrl',
      'nextTrack',
      'clearPlayList',
      'updateCurrentTime',
      'setDuration',
      'setJumping',
      'setTrackUrl',
      'setTrackLyric'
    ]),
    ...mapMutations([
      'SET_LYRIC_STATE',
      'SET_URL_STATE'
    ]),
    async setUrl () {
      if (!this.currentTrack.url) {
        // 清空上一首正在播放的歌曲
        this.url = ''
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
      }
      if (this.url === this.currentTrack.url) return
      this.url = this.currentTrack.url
    },
    async setLyric () {
      if (!this.currentLyric) {
        this.SET_LYRIC_STATE({
          state: LOADING
        })
        const result = await this.setTrackLyric(this.currentTrack.id)
        if (!result) {
          this.SET_LYRIC_STATE({
            state: ERROR
          })
        } else {
          this.SET_LYRIC_STATE({
            state: LOADED
          })
        }
      }
    },
    onerror (e) {
      this.error = 'error'
      if (this.url === '') return
      if (this.currentIndex === this.playlist.length - 1) return
      this.setDuration(0)
      this.pause()
    },
    onended () {
      this.nextTrack()
    },
    onplay () {
      this.play()
    },
    onpause () {
      this.pause()
    },
    ondurationchange () {
      this.setDuration(this.player.duration)
    },
    onloadedmetadata () {
      this.updateCurrentTime(this.player.currentTime)
    },
    ontimeupdate () {
      if (this.jumping) {
        this.player.currentTime = this.currentTime
        this.setJumping(false)
      }
      // 安卓手机兼容
      if (!this.duration && this.player.duration) {
        this.setDuration(this.player.duration)
      }
      this.updateCurrentTime(this.player.currentTime)
    }
  }
}
</script>
