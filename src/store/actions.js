import { getMusicUrl, getLyric, getUserPlayList, getPlayListDetail } from '@/api'

export default {
  play ({commit, state}) {
    commit('PLAY')
  },
  pause ({commit, state}) {
    commit('PAUSE')
  },
  control ({commit, state}) {
    if (state.playing) {
      commit('PAUSE')
    } else {
      commit('PLAY')
    }
  },
  addTrack ({commit, state}, track) {
    let formatTrack = {}
    // 判断两种数据格式的单曲，进行格式统一
    formatTrack.id = track.id
    formatTrack.name = track.name
    if (track.album && track.artists) {
      formatTrack.album = track.album
      formatTrack.artists = track.artists
    } else if (track.al && track.ar) {
      formatTrack.album = track.al
      formatTrack.artists = track.ar
    }
    commit('ADD_TRACK', {
      track: formatTrack
    })
  },
  deleteTrack ({commit}, id) {
    commit('DELETE_TRACK', {
      id
    })
  },
  toTrack ({commit}, id) {
    commit('TO_TRACK', {
      id
    })
  },
  nextTrack ({commit, state}) {
    if (state.currentIndex >= state.playlist.length - 1) {
      console.log('已到最后一首')
      return
    }
    commit('NEXT_TRACK')
  },
  previousTrack ({commit, state}) {
    if (state.currentIndex === 0) {
      console.log('已到最前一首')
      return
    }
    commit('PREV_TRACK')
  },
  setLoadingUrl ({commit}, isLoading) {
    commit('SET_LOADING_URL', {
      isLoading
    })
  },
  clearPlayList ({commit}) {
    commit('CLEAR_PLAYLIST')
  },
  setDuration ({commit}, duration) {
    commit('SET_DURATION', {
      duration
    })
  },
  updateCurrentTime ({commit}, currentTime) {
    commit('UPDATE_CURRENTTIME', {
      currentTime
    })
  },
  setJumping ({commit}, jumping) {
    commit('SET_JUMPING', {
      jumping
    })
  },
  setIsFM ({commit}, isFM) {
    commit('SET_IS_FM', {
      isFM
    })
  },
  setMyId ({commit}, myid) {
    commit('SET_MY_ID', {
      myid
    })
  },
  async setTrackUrl ({commit}, id) {
    const url = await getMusicUrl(id)
    if (!url) {
      console.log('歌曲url获取失败')
      return
    }
    commit('SET_TRACK_URL', {
      id,
      url: url.data.data[0].url
    })
    return true
  },
  async setTrackLyric ({commit}, id) {
    let lyric = await getLyric(id)
    if (!lyric) {
      console.log('歌词获取失败')
      return
    }
    let lrc = lyric.data.lrc
    if (lrc) {
      lyric = lrc.lyric
    } else {
      lyric = '没有歌词啊'
    }
    commit('SET_TRACK_LYRIC', {
      id,
      lyric
    })
    return lyric
  },
  async getLikedList ({commit, state}) {
    if (!state.myid) {
      console.log('getLikedList: not logged in!')
      return
    }
    let likedListId = -1
    if (!window.localStorage.likedListId) {
      let ret = await getUserPlayList(state.myid)

      if (!ret) {
        console.log('getUserList error')
        return
      }
      likedListId = ret.data.playlist[0].id
      window.localStorage.likedListId = likedListId
    } else {
      likedListId = window.localStorage.likedListId
    }

    let ret = await getPlayListDetail(likedListId)
    if (!ret) {
      console.log('get Play List error')
      return
    }
    console.log(ret.data)
    let likedList = ret.data.playlist.trackIds.map(item => item.id)
    commit('GET_LIKED_LIST', {
      likedList
    })
  }
}
