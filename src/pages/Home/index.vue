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
      <tab-item :key="item" v-for="(item, key) in tabMap" :selected="$route.params.tab === key" @on-item-click="onTabClick">
        {{item}}
      </tab-item>
    </tab>
    <div class="wrapper">
      <transition name="fade">
        <keep-alive>
          <component :is="currentView"></component>
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
import { refreshLogin } from '@/api'
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
      tabList: ['recommend', 'playlist', 'rank'],
      drawerState: false
    }
  },
  computed: {
    ...mapState([
      'myid'
    ]),
    currentView () {
      return this.$route.params.tab
    }
  },
  methods: {
    onTabClick (index) {
      const tab = this.tabList[index]
      if (tab === this.$route.params.tab) return
      this.$router.push(tab)
    },
    showDrawer () {
      this.drawerState = true
    },
    async _refreshLogin () {
      const res = await refreshLogin()
      console.log(res)
    },
    loginPath () {
      const cookie = Cookie.get('__csrf')
      if (cookie) {
        return `/user/${this.myid}`
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

