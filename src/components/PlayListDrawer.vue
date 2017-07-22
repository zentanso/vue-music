<template>
  <popup v-model="state" position="bottom" max-height="50%" @on-hide="onHide">
    <ul>
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
  </popup>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Popup } from 'vux'

export default {
  name: 'play-list-drawer',
  props: ['show'],
  model: {
    prop: 'show',
    event: 'updateState'
  },
  components: {
    Popup
  },
  computed: {
    ...mapState([
      'playlist',
      'currentIndex'
    ]),
    state () {
      return this.show
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
      'deleteTrack'
    ]),
    onHide () {
      this.$emit('updateState', false)
    },
    onTrackClick (id) {
      this.toTrack(id)
    },
    onTrackDelete (id) {
      this.deleteTrack(id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/theme';

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
