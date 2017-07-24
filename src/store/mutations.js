import {
  PLAY,
  PAUSE,
  ADD_TRACK,
  DELETE_TRACK,
  TO_TRACK,
  NEXT_TRACK,
  PREV_TRACK,
  CLEAR_PLAYLIST,
  SET_LOADING_URL,
  UPDATE_CURRENTTIME,
  SET_DURATION,
  SET_JUMPING,
  SET_TRACK_URL,
  SET_TRACK_LYRIC,
  SET_LYRIC_STATE,
  SET_URL_STATE,
  SET_USER_ID,
  SET_IS_FM,
  GET_LIKED_LIST,
  SET_PLAYER_MODE
} from './mutation-types'

import {SINGLE, LIST_CYCLE, RANDOM} from '@/constants'

export default {
  [PLAY] (state) {
    state.playing = true
  },
  [PAUSE] (state) {
    state.playing = false
  },
  [ADD_TRACK] (state, payload) {
    const id = payload.track.id
    let trackIndex = -1
    const duplicated = state.playlist.some((item, index) => {
      if (item.id === id) {
        trackIndex = index
        return true
      }
    })
    if (duplicated) {
      state.currentIndex = trackIndex
      return
    }
    state.playlist.push(payload.track)
  },
  [DELETE_TRACK] (state, payload) {
    const id = payload.id
    let trackIndex = -1
    state.playlist = state.playlist.filter((item, index) => {
      if (item.id === id) {
        trackIndex = index
      }
      return item.id !== id
    })
    if (trackIndex < state.currentIndex) {
      state.currentIndex--
    }
  },
  [CLEAR_PLAYLIST] (state) {
    state.playlist = []
    state.playing = false
    state.currentIndex = 0
  },
  [TO_TRACK] (state, payload) {
    let trackIndex = -1
    state.playlist.forEach((item, index) => {
      if (item.id === payload.id) {
        trackIndex = index
      }
    })
    if (trackIndex === -1) {
      return
    }
    state.currentIndex = trackIndex
  },
  [PREV_TRACK] (state) {
    switch (state.mode) {
      case SINGLE:
        state.currentTime = 0
        break
      case LIST_CYCLE:
        if (state.currentIndex !== 0) {
          state.currentIndex--
        } else {
          state.currentIndex = state.playlist.length - 1
        }
        break
      case RANDOM:
        const index = Math.floor(state.playlist.length * Math.random())
        state.currentIndex = index
        break
      default:
        break
    }
  },
  [NEXT_TRACK] (state) {
    switch (state.mode) {
      case SINGLE:
        state.currentTime = 0
        break
      case LIST_CYCLE:
        if (state.currentIndex < state.playlist.length - 1) {
          state.currentIndex++
        } else {
          state.currentIndex = 0
        }
        break
      case RANDOM:
        const index = Math.floor(state.playlist.length * Math.random())
        state.currentIndex = index
        break
      default:
        break
    }
  },
  [SET_LOADING_URL] (state, payload) {
    state.loadingUrl = payload.isLoading
  },
  [UPDATE_CURRENTTIME] (state, payload) {
    state.currentTime = payload.currentTime
  },
  [SET_DURATION] (state, payload) {
    state.duration = payload.duration
  },
  [SET_JUMPING] (state, payload) {
    state.jumping = payload.jumping
  },
  [SET_TRACK_URL] (state, payload) {
    state.playlist = state.playlist.map((item) => {
      if (item.id === payload.id) {
        return {
          ...item,
          url: payload.url
        }
      }
      return item
    })
  },
  [SET_TRACK_LYRIC] (state, payload) {
    state.playlist = state.playlist.map((item) => {
      if (item.id === payload.id) {
        return {
          ...item,
          lyric: payload.lyric
        }
      }
      return item
    })
  },
  [SET_LYRIC_STATE] (state, payload) {
    state.loadState.lyric = payload.state
  },
  [SET_URL_STATE] (state, payload) {
    state.loadState.url = payload.state
  },
  [SET_USER_ID] (state, payload) {
    state.userid = payload.userid
  },
  [SET_IS_FM] (state, payload) {
    state.isFM = payload.isFM
  },
  [GET_LIKED_LIST] (state, payload) {
    state.likedList = payload.likedList
  },
  [SET_PLAYER_MODE] (state, payload) {
    state.mode = payload.mode
  }
}
