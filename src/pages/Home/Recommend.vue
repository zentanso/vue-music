<template>
  <div>
    <swiper auto :list="banner" :aspect-ratio="145/375"></swiper>
    <div class="rec-wrapper">
      <div>
        <router-link :to="myid ? '/trackdetail?type=FM' : '/login'">
          <span>
            <x-icon type="radio-waves" class="rec-icon"></x-icon>
          </span>
          <p>私人FM</p>
        </router-link>
      </div>
      <div>
        <router-link :to="myid ? '/playlistdetail/recommend' : '/login'">
          <span>
            <x-icon type="calendar" class="rec-icon"></x-icon>          
          </span>
          <p>每日歌曲推荐</p>
        </router-link>
      </div>
      <div>
        <router-link to="/playlistdetail/3778678">
          <span>
            <x-icon type="stats-bars" class="rec-icon"></x-icon>
          </span>
          <p>云音乐热歌榜</p>
        </router-link>
      </div>
    </div>
    <div class="play-group">
      <h2 class="group-title">
        <router-link to="playlist">推荐歌单</router-link>
      </h2>
      <load-error :callback="initRecommendSongList" :show="loadState.recommendList === ERROR"></load-error>
      <m-loading v-if="loadState.recommendList === LOADING" tip="努力加载中^_^"></m-loading>
      <div class="group-content">
        <router-link v-for="item in recommendList" :key="item.id" :to="`/playlistdetail/${item.id}`">
          <square-pic-item :size="picSize" :pic="item.picUrl" :desc="item.name">
            <span slot="top-right">
              <x-icon size="12" type="headphone"></x-icon>
              {{item.playCount | getListenNum}}
            </span>
          </square-pic-item>
        </router-link>
      </div>
    </div>
    <div class="play-group">
      <h2 class="group-title">
        <router-link to="playlist">推荐音乐</router-link>
      </h2>
      <load-error :show="loadState.newSongs === ERROR"></load-error>
      <m-loading v-if="loadState.newSongs === LOADING" tip="努力加载中^_^"></m-loading>
      <div class="group-content">
        <square-pic-item @click.native="onSongClick(item.song)" v-for="item in newSongs" :key="item.id" :size="picSize" :pic="item.picUrl" :desc="item.name">
        </square-pic-item>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper } from 'vux'
import SquarePicItem from '@/components/SquarePicItem'
import MLoading from '@/components/MLoading'
import LoadError from '@/components/LoadError'
import { mapState, mapActions } from 'vuex'
import {
  getRecommendSongList,
  getNewSong,
  getBanner,
  getRecommendSongs
} from '@/api'
import { getListenNum } from '@/filters'

import { LOADED, LOADING, ERROR } from '@/constants'

export default {
  name: 'recommend',
  data () {
    return {
      banner: [
        {
          img: 'http://p1.music.126.net/ntBTJFyafc68tBybLfWVww==/19155691579345148.jpg'
        },
        {
          img: 'http://p1.music.126.net/0sDwLx0-YVD6ALyTjZAtOg==/18658712325254492.jpg'
        },
        {
          img: 'http://p1.music.126.net/LrAgAxQAe0_qHMd-IXPCfg==/18598239185799345.jpg'
        },
        {
          img: 'http://p1.music.126.net/JHLcF8kOES7pyibLAjHqjA==/18765364953234950.jpg'
        }
      ],
      picSize: '5rem',
      recommendList: [],
      newSongs: [],
      loadState: {
        newSongs: LOADED,
        recommendList: LOADED,
        banner: LOADED
      },
      LOADING,
      LOADED,
      ERROR
    }
  },
  filters: {
    getListenNum
  },
  components: {
    Swiper,
    SquarePicItem,
    MLoading,
    LoadError
  },
  mounted () {
    this.onMounted()
  },
  activated () {
    document.body.scrollTop = 0
  },
  computed: {
    ...mapState(
      ['myid']
    )
  },
  methods: {
    ...mapActions([
      'addTrack',
      'toTrack',
      'setIsFM',
      'clearPlayList'
    ]),
    async onMounted () {
      await Promise.all([
        // 这个接口有毒！频繁调用会被网易拉黑0.0
        // this.initBanner(),
        this.initRecommendSongList(),
        this.initNewSongs()
      ])
    },
    async initBanner () {
      this.loadState.banner = LOADING
      let result = await getBanner()
      if (!result) {
        this.loadState.banner = ERROR
        return
      }
      result = result.data.banners
      result = result.map(item => {
        return {
          url: 'javascript:void(0)',
          img: item.pic,
          title: item.typeTitle
        }
      })
      this.banner = result
      this.loadState.banner = LOADED
    },
    async initRecommendSongList () {
      this.loadState.recommendList = LOADING
      let recSongList = await getRecommendSongList()
      if (!recSongList) {
        console.log('数据获取失败')
        this.loadState.recommendList = ERROR
        return
      }
      recSongList = recSongList.data.result
      this.recommendList = recSongList.map(({picUrl, name, playCount, id}) => {
        return {
          picUrl: picUrl + '?param=140y140',
          name,
          playCount,
          id
        }
      })
      this.loadState.recommendList = LOADED
    },
    async initNewSongs () {
      this.loadState.newSongs = LOADING
      let newSongs = await getNewSong()
      if (!newSongs) {
        this.loadState.newSongs = ERROR
        return
      }
      newSongs = newSongs.data.result.slice(0, 9)
      this.newSongs = newSongs.map(({name, id, song}) => {
        return {
          song,
          picUrl: song.album.picUrl + '?param=140y140',
          name,
          id
        }
      })
      this.loadState.newSongs = LOADED
    },
    onSongClick (item) {
      this.setIsFM(false)
      this.clearPlayList()
      this.addTrack(item)
      // this.toTrack(id)
    },
    async _getRec () {
      const res = await getRecommendSongs()
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/theme';
@import '../../styles/mixins';
.rec-wrapper {
  display: flex;
  justify-content: space-around;
  padding: 1rem 0 1rem 0;
  border-bottom: 1px solid @light-grey;
  > * {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 0.5rem;
    text-align: center;
    span {
      box-sizing: border-box;
      display: block;
      height: 100%;
      margin-bottom: 0.2rem;
      .circle-btn(3rem);
      .allcenter();
      border: 1px solid @theme-color;
    }
  }
}

.rec-icon {
  .square(2rem);
  fill: @theme-color;
}

.group-title {
  box-sizing: border-box;
  border-left: 5px solid @theme-color;
  font: 14px normal;
  line-height: 2.5;
  padding-left: 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
}

.group-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
}

</style>
