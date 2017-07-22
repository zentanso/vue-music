import { get } from './util'
// ----------------个性推荐页-------------------
// 获取banner图片
export function getBanner () {
  return get('/banner')
}

// 获取推荐歌单
export function getRecommendSongList () {
  return get('/personalized')
}
// 获取独家放送
export function getPrivateContent () {
  return get('/personalized/privatecontent')
}
// 获取最新音乐
export function getNewSong () {
  return get('/personalized/newsong')
}

// -----------------歌单页------------------------
// 获取歌单
export function getPlayList (limit, type, offset, order) {
  return get('/top/playlist', {
    params: {
      limit,
      order,
      cat: type,
      offset
    }
  })
}

// 获取精品歌单
export function getHighQualityPlayList (limit, type) {
  return get('/top/playlist/highquality', {
    params: {
      limit,
      cat: type
    }
  })
}
// 获取歌单详情
export async function getPlayListDetail (id) {
  return get('/playlist/detail', {
    params: {
      id
    }
  })
}

// -----------------排行榜页面--------------------
// 获取排行榜概览
export function getTopList () {
  return get('/toplist')
}

// -----------------歌曲页详情--------------------
// 获取音乐url
export function getMusicUrl (id) {
  return get('/music/url', {
    params: {
      id
    }
  })
}

// 获取歌词
export function getLyric (id) {
  return get('/lyric', {
    params: {
      id
    }
  })
}

// -----------------评论页（歌单或歌曲）--------------------
// 歌曲评论
export function getMusicComment (id, limit = 20, offset = 0) {
  return get('/comment/music', {
    params: {
      id,
      limit,
      offset
    }
  })
}
// 歌单评论
export function getPlayListComment (id, limit = 20, offset = 0) {
  return get('/comment/playlist', {
    params: {
      id,
      limit,
      offset
    }
  })
}

export function getAlbumComment (id, limit = 20, offset = 0) {
  return get('/comment/album', {
    params: {
      id,
      limit,
      offset
    }
  })
}

// -----------------搜索页------------------------
// 搜索
export function search (keywords, type, limit = 20, offset = 0) {
  return get('/search', {
    params: {
      keywords,
      limit,
      offset,
      type
    }
  })
}

//  ------------------ 登陆相关 -------------------------
export function login (phone, password) {
  return get('/login/cellphone', {
    params: {
      phone,
      password
    }
  })
}
// 刷新登录状态
export function refreshLogin () {
  return get('/login/refresh')
}
// 获取每日推荐
export function getRecommendSongs () {
  return get('/recommend/songs')
}
// 私人FM
export function getPersonalFM () {
  return get('/personal_fm')
}
// 加红心
export function likeTrack (id, like) {
  return get('/like', {
    params: {
      id,
      like
    }
  })
}
// 垃圾桶
export function fmTrash (id) {
  return get('/fm_trash', {
    params: {
      id
    }
  })
}

// ----------------- 用户页 -------------------------
export function getUserDetail (uid) {
  return get('/user/detail', {
    params: {
      uid
    }
  })
}

export function getUserRecord (uid) {
  return get('/user/record', {
    params: {
      uid
    }
  })
}

export function getUserPlayList (uid) {
  return get('/user/playlist', {
    params: {
      uid
    }
  })
}
