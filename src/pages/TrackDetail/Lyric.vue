<template>
  <div class="lyric-content">
    <div class="content-wrapper" :style="{transform: `translateY(-${lyricIndex === -1 ? 0 : lyricPos[lyricIndex]}px)`}">
      <p 
        v-for="(item, index) in lyricArr" 
        :class="[index === lyricIndex ? 'hint' : '']"
        :key="item.time"
      >
        {{item.str}}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'lyric',
  data () {
    return {
      error: false,
      lyricIndex: 0,
      lyricPos: []
    }
  },
  computed: {
    ...mapState([
      'currentTime',
      'duration'
    ]),
    ...mapGetters([
      'currentLyric',
      'currentTrack'
    ]),
    lyricArr () {
      return this.formatLyric(this.currentLyric)
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
