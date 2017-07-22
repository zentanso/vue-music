import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

import { LOADED } from '@/constants'

Vue.use(Vuex)

const state = {
  loadState: {
    url: LOADED,
    lyric: LOADED
  },
  playlist: [],
  vol: 100,
  duration: 0,
  currentTime: 0,
  playing: false,
  currentIndex: 0,
  jumping: false,
  myid: 0,
  isFM: false,
  likedList: []
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  strict: true
})
