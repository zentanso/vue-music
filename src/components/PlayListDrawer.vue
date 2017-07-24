<template>
  <popup v-model="state" position="bottom" max-height="50%" @on-hide="onHide">
    <div class="drawer-header">
      <span @click="_setPlayerMode">{{modeMap[mode]}}</span>
    </div>
    <div style="max-height: 50vh; overflow: scroll">
      <ul style="margin-top: 40px">
        <li 
          v-for="(track, index) in playlist" 
          :key='track.id' 
          :left="false" 
          class="track-item"
          @click.stop="onTrackClick(track.id)"
        >
          <div :class="['track-info', currentIndex === index ? 'playing' : '']">
            {{track.name}}
            <span class="author">{{`-${track.artists[0].name}`}}</span>
          </div>
          <x-icon @click.stop="onTrackDelete(track.id)" type="ios-close-empty" class="delete-btn"></x-icon>
        </li>
      </ul>
    </div>
  </popup>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Popup } from 'vux'
import { SINGLE, LIST_CYCLE, RANDOM } from '@/constants'

export default {
  name: 'play-list-drawer',
  props: ['show'],
  model: {
    prop: 'show',
    event: 'updateState'
  },
  data () {
    return {
      modeList: [SINGLE, LIST_CYCLE, RANDOM],
      modeMap: {
        [SINGLE]: '单曲循环',
        [LIST_CYCLE]: '列表循环',
        [RANDOM]: '随机播放'
      }
    }
  },
  components: {
    Popup
  },
  computed: {
    ...mapState([
      'playlist',
      'currentIndex',
      'mode'
    ]),
    state () {
      return this.show
    },
    modeIndex () {
      const index = this.modeList.indexOf(this.mode)
      return index
    }
  },
  watch: {
    playlist () {
      if (this.playlist.length === 0) {
        this.$emit('updateState', false)
      }
    }
  },
  methods: {
    ...mapActions([
      'toTrack',
      'deleteTrack',
      'setPlayerMode'
    ]),
    onHide () {
      this.$emit('updateState', false)
    },
    onTrackClick (id) {
      this.toTrack(id)
    },
    onTrackDelete (id) {
      this.deleteTrack(id)
    },
    _setPlayerMode () {
      let index = -1
      if (this.modeIndex < this.modeList.length - 1) {
        index = this.modeIndex + 1
      } else {
        index = 0
      }
      this.setPlayerMode(this.modeList[index])
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/theme';

.drawer-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  font-size: 14px;
  color: grey;
  background-color: #eee;
  border-bottom: 1px solid #e1e1e2;
  z-index: 1;
}

.track-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid @light-grey
}

.track-info {
  padding: 0.5rem 0 0.5rem 0.5rem;
  font-size: 16px;
  .author {
    font-size: 12px;
    color: grey;
  }
  &.playing {
    color: @theme-color
  }
}

.delete-btn {
  fill: grey
}
</style>
