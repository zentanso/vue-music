export default {
  currentLyric (state) {
    const currentTrack = state.playlist[state.currentIndex]
    return currentTrack ? currentTrack.lyric : ''
  },
  currentTrack (state) {
    return state.playlist[state.currentIndex]
  },
  urlState (state) {
    return state.loadState.url
  },
  lyricState (state) {
    return state.loadState.lyric
  }
}
