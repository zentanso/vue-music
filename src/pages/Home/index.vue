<template>
  <div>
    <x-header class="header-wrapper">
      网易云音乐
      <router-link :to="loginPath()" slot="overwrite-left" >
        <x-icon type="android-person" class="topbar-icon"></x-icon>
      </router-link>
      <router-link slot="right" to="/search">
        <x-icon type="ios-search-strong" class="topbar-icon"></x-icon>
      </router-link>
    </x-header>
    <tab class="tab-container">
      <tab-item :key="item" v-for="(item, key) in tabMap" :selected="currentTab === key" @on-item-click="onTabClick">
        {{item}}
      </tab-item>
    </tab>
    <div class="wrapper">
      <transition name="fade">
        <keep-alive>
          <component :is="currentTab"></component>
        </keep-alive>
      </transition>
    </div>
    <mini-player-bar @on-list-click="showDrawer"></mini-player-bar>
    <play-list-drawer v-model="drawerState"></play-list-drawer>
  </div>
</template>

<script>
import { XHeader, Tab, TabItem } from 'vux'
import MiniPlayerBar from '@/components/MiniPlayerBar'
import PlayListDrawer from '@/components/PlayListDrawer'
import Recommend from './Recommend'
import PlayList from './PlayList'
import Rank from './Rank'
import Cookie from '@/util/cookie'
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    XHeader,
    Tab,
    TabItem,
    recommend: Recommend,
    playlist: PlayList,
    rank: Rank,
    MiniPlayerBar,
    PlayListDrawer
  },
  data () {
    return {
      tabMap: {
        recommend: '个性推荐',
        playlist: '歌单',
        rank: '排行榜'
      },
      drawerState: false
    }
  },
  computed: {
    ...mapState([
      'userid'
    ]),
    currentTab () {
      return this.$route.params.tab
    }
  },
  methods: {
    onTabClick (index) {
      const arr = Object.keys(this.tabMap)
      const tab = arr[index]
      if (tab === this.currentTab) return
      this.$router.push(tab)
    },
    showDrawer () {
      this.drawerState = true
    },
    loginPath () {
      const cookie = Cookie.get('__csrf')
      if (cookie) {
        return `/user/${this.userid}`
      } else {
        return '/login'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme.less';
@import '../../styles/mixins.less';

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 499;
}

.tab-container {
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
  z-index: 499;
}

.wrapper {
  position: relative;
  margin-top: 90px;
  padding-bottom: 3rem;
}

.tab-content {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>

