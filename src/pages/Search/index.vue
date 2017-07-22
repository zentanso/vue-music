<template>
  <div>
    <x-header class="header-wrapper">
      <span slot="overwrite-left" @click="goBack">
        <x-icon type="android-close" class="topbar-icon"></x-icon>
      </span>
      <input 
        v-model="key" 
        type="text" 
        slot="default" 
        placeholder="搜索音乐" 
        class="search-input"
        @keypress="onkeypress"
      >
      <x-icon type="android-search" class="topbar-icon" slot="right" @click="getSearchResult"></x-icon>
    </x-header>
    <tab class="tab-container">
      <tab-item :selected="tabNum === 0" @on-item-click="onTabClick">单曲</tab-item>
      <tab-item :selected="tabNum === 1" @on-item-click="onTabClick">歌单</tab-item>
    </tab>
    <div class="wrapper">
      <div v-show="tabType === 'songs'">
        <loading-msg
          :isLoading="loadingSongs"
          :isError="loadSongsError"
          :reloadFunc="getSearchResult"
        >
        </loading-msg>
        <ul>
          <li class="result-item" :left="false" :key="item.id" v-for="item in result.songs" @click="onSongClick(item)">
            <p class="title">{{item.name}}</p>
            <p class="subtitle">{{`${item.artists[0].name} - ${item.album.name}`}}</p>
          </li>
        </ul>
      </div>
      <div v-show="tabType === 'playlists'">
        <loading-msg
          :isLoading="loadingPlayLists"
          :isError="loadPlayListsError"
          :reloadFunc="getSearchResult"
        >
        </loading-msg>
        <ul>
          <li class="result-item" :left="false" :key="item.id" v-for="item in result.playlists" @click="onPlayListClick(item.id)">
            <p class="title">{{item.name}}</p>
            <p class="subtitle">{{`${item.trackCount}首 by ${item.creator.nickname}, 播放${item.playCount}次`}}</p>
          </li>
        </ul>
      </div>
    </div>
    <mini-player-bar @on-list-click="showDrawer"></mini-player-bar>
    <play-list-drawer v-model="drawerState"></play-list-drawer>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem } from 'vux'
import MiniPlayerBar from '@/components/MiniPlayerBar'
import { search } from '@/api'
import PlayListDrawer from '@/components/PlayListDrawer'
import { mapActions } from 'vuex'
import { LOADING, LOADED, ERROR } from '@/constants'
import LoadingMsg from '../common/LoadingMsg'

export default {
  name: 'search',
  components: {
    XHeader,
    MiniPlayerBar,
    PlayListDrawer,
    Tab,
    TabItem,
    LoadingMsg
  },
  data () {
    return {
      lastKey: -1,
      key: '',
      result: {
        songs: null,
        playlists: null
      },
      drawerState: false,
      tabNum: 0,
      tabTypes: ['songs', 'playlists'],
      tabMap: {
        songs: 1,
        playlists: 1000
      },
      loadState: {
        songs: LOADED,
        playlists: LOADED
      }
    }
  },
  computed: {
    tabKey () {
      return this.tabMap[this.tabTypes[this.tabNum]]
    },
    tabType () {
      return this.tabTypes[this.tabNum]
    },
    loadingSongs () {
      return this.loadState.songs === LOADING
    },
    loadSongsError () {
      return this.loadState.songs === ERROR
    },
    loadingPlayLists () {
      return this.loadState.playlists === LOADING
    },
    loadPlayListsError () {
      return this.loadState.playlists === ERROR
    }
  },
  methods: {
    ...mapActions([
      'addTrack',
      'toTrack'
    ]),
    goBack () {
      this.$router.go(-1)
    },
    async getSearchResult () {
      if (this.key === undefined || this.key.length === 0) return
      this.loadState[this.tabType] = LOADING
      const result = await search(this.key, this.tabKey, 20)
      if (!result) {
        this.loadState[this.tabType] = ERROR
        return
      }

      this.result[this.tabType] = result.data.result[this.tabType]
      this.loadState[this.tabType] = LOADED
    },
    initResult () {
      for (let i in this.result) {
        this.result[i] = null
      }
    },
    onSearchClick () {
      this.initResult()
      this.getSearchResult()
    },
    onkeypress (e) {
      if (e.keyCode === 13 && e.target.value) {
        this.initResult()
        this.getSearchResult()
        e.target.blur()
      }
    },
    onSongClick (item) {
      const {id} = item
      this.addTrack(item)
      this.toTrack(id)
    },
    onPlayListClick (id) {
      this.$router.push(`/playlistdetail/${id}`)
    },
    showDrawer () {
      this.drawerState = true
    },
    onTabClick (index) {
      this.tabNum = index
    }
  },
  watch: {
    async tabNum () {
      if (this.loadState[this.tabType] === LOADING) return
      if (this.result[this.tabType]) return
      await this.getSearchResult()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme';
.header-wrapper {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 499;
}

.tab-container {
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
  z-index: 499;
}

.search-input {
  padding: 0;
  height: 30px;
  font-size: 14px;
  width: 100%;
  border-style: none;
  background-color: @theme-color;
  color: #fff;
  outline: none; 
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #fff;
}

.search-input::placeholder {
  color: #fff;
}

.wrapper {
  margin-top: 90px;
  padding-bottom: 3rem;
}

.result-item {
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-bottom: 1px solid @light-grey;
  .title {
    font-size: 14px;
    padding-bottom: 0.2rem;
    color: #8f91ff;
  }
  .subtitle {
    font-size: 10px;
  }
}
</style>
