<template>
  <div class="lyric-content">
    <div ref="lyricWrapper" class="content-wrapper" :style="{transform: `translateY(-${lyricIndex === -1 ? 0 : lyricPos[lyricIndex]}px)`}">
      <p 
        v-for="(item, index) in lyricArr" 
        :class="[index === lyricIndex ? 'hint' : '']"
        :key="item.time"
      >
        {{item.str}}
      </p>
      
    </div>
    <loading-msg
        :isLoading="loadingLyric"
        :isError="loadLyricError"
        :reloadFunc="reloadLyric"
        loadingMsg="加载歌词中"
    >
    </loading-msg>
    <div v-show="lyricPos.length <= 1 && loadedLyric">暂时没有歌词（￣▽￣）</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { LOADING, LOADED, ERROR } from '@/constants'
import LoadingMsg from '@/pages/common/LoadingMsg'

export default {
  name: 'lyric',
  data () {
    return {
      error: false,
      lyricIndex: 0,
      lyricPos: []
    }
  },
  components: {
    LoadingMsg
  },
  computed: {
    ...mapState([
      'currentTime',
      'duration',
      'loadState'
    ]),
    ...mapGetters([
      'currentLyric',
      'currentTrack'
    ]),
    lyricArr () {
      return this.formatLyric(this.currentLyric)
    },
    loadingLyric () {
      return this.loadState.lyric === LOADING
    },
    loadLyricError () {
      return this.loadState.lyric === ERROR
    },
    loadedLyric () {
      return this.loadState.lyric === LOADED
    }
  },
  mounted () {
    const $this = this
    this.$nextTick(() => {
      $this.getLyricPos()
    })
  },
  activated () {
    const $this = this
    this.$nextTick(() => {
      $this.getLyricPos()
    })
  },
  watch: {
    lyricArr () {
      if (this.currentLyric) {
        const $this = this
        this.$nextTick(() => {
          $this.getLyricPos()
        })
      }
    },
    currentTime () {
      if (!this.lyricArr.length) return 0
      const trackTime = Math.floor(100 * this.currentTime)
      let toIndex = -1
      const $this = this
      const arr = this.lyricArr
      for (let i = 0, len = arr.length; i < len; i++) {
        let start = Math.floor(100 * arr[i].time)
        let end = -1
        if (i === len - 1) {
          end = Math.floor(100 * $this.duration)
        } else {
          end = Math.floor(100 * arr[i + 1].time)
        }
        if (trackTime > start && trackTime < end) {
          toIndex = i
          break
        }
      }
      this.lyricIndex = toIndex
    }
  },
  methods: {
    ...mapMutations([
      'SET_LYRIC_STATE'
    ]),
    ...mapActions([
      'setTrackLyric'
    ]),
    formatLyric (lyric) {
      if (!lyric) return []
      const arr = lyric.split('\n')
      const ret = []
      arr.forEach((item) => {
        const m = item.match(/^\[(\d*):(\d*\.\d*)]*\](.*)$/)
        if (!m) return
        const min = m[1]
        const sec = m[2]
        const time = min * 60 + Number(sec)
        const str = m[3]
        ret.push({
          time,
          str
        })
      })
      return ret
    },
    getLyricPos () {
      this.lyricPos = []
      let lyrics = this.$el.getElementsByTagName('p')
      const $this = this
      lyrics = [...lyrics]
      this.$el.style.display = 'block'
      lyrics.reduce((all, item) => {
        $this.lyricPos.push(all)
        return all + item.clientHeight
      }, 0)
      this.$el.style.display = ''
    },
    async reloadLyric () {
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
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme';
.lyric-content {
  height: 50vh;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  p {
    padding-bottom: 10px;
  }
}

.content-wrapper {
  position: relative;
  top: 10vh;
  left: 10vw;
  width: 80vw;
  transition: transform .3s linear;
}

.hint {
  color: @theme-color
}
</style>
