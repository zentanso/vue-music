<template>
  <div v-if="playlist.length" class="mini-player-bar" @click="onBarClick">
    <span class="album-pic">
      <img :src="albumPic">
    </span>
    <span class="track-info">
      <h3 class="title" slot="title">{{name}}</h3>
      <p class="subtitle" slot="subtitle">{{artist}}</p>
    </span>    
    <span class="control">
      <span class="player-btn" @click.stop="control">
        <span v-if="!playing">
          <x-icon type="ios-play-outline" class="mini-player-icon"></x-icon>
        </span>
        <span v-else>
          <x-icon type="ios-pause-outline" class="mini-player-icon"></x-icon>
        </span>
      </span>
      <span v-if="!isFM" class="list-btn" @click.stop="onListClick">
        <x-icon type="ios-list-outline" class="mini-player-icon"></x-icon>
      </span>
    </span>
    <div class="progress-bar" :style="{'width': currentProgress + '%'}"></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import PlayListDrawer from '@/components/PlayListDrawer'

export default {
  name: 'mini-player-bar',
  components: {
    PlayListDrawer
  },
  computed: {
    ...mapState([
      'playing',
      'currentTime',
      'duration',
      'currentIndex',
      'playlist',
      'isFM'
    ]),
    ...mapGetters([
      'currentTrack'
    ]),
    currentProgress () {
      if (this.duration) {
        return parseInt((this.currentTime / this.duration) * 100)
      }
      return 0
    },
    albumPic () {
      if (!this.currentTrack) return
      return this.currentTrack.album.picUrl + '?param=80y80'
    },
    name () {
      if (!this.currentTrack) return
      return this.currentTrack.name
    },
    artist () {
      if (!this.currentTrack) return
      return this.currentTrack.artists[0].name
    }
  },
  methods: {
    ...mapActions([
      'control'
    ]),
    onBarClick () {
      if (this.isFM) {
        this.$router.push('/trackdetail?type=FM')
      } else {
        this.$router.push('/trackdetail')
      }
    },
    onListClick () {
      this.$emit('on-list-click')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/mixins';
@import '../styles/theme';
.mini-player-bar {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  z-index: 500;
}

.album-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    .square(2rem);
    padding: 0.2rem
  }
}

// .track-info,
.control {
  display: flex;
  width: 3.5rem;
  justify-content: space-around;
  align-items: center;
}

.track-info {
  flex: 1;
  .title {
    font-weight: normal;
    font-size: 14px;
  }
  .subtitle {
    font-size: 8px;
    color: grey;
  }
}

.mini-player-icon {
  fill: #000;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.1rem;
  background-color: @theme-color;
}
</style>
