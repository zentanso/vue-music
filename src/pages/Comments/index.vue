<template>
  <div>
    <x-header class="header-wrapper">
      {{`评论(${commentData.total || 0})`}}
      <x-icon slot="overwrite-left" type="android-arrow-back" class="topbar-icon" @click="$router.back()"></x-icon>
    </x-header>
    <div 
      class="wrapper"
      v-infinite-scroll="getMoreComment" 
      infinite-scroll-disabled="loadingComment" 
      infinite-scroll-distance="100"
    >
      <div class="comment-type" v-if="commentData.hotComments && commentData.hotComments.length">精彩评论</div>
      <ul class="comment-list">
        <li :key="item.id" v-for="item in commentData.hotComments" class="comment-list-item">
          <router-link :to="`/user/${item.user.userId}`" class="avatar" :style="{backgroundImage: `url(${item.user.avatarUrl})`}">
          </router-link>
          <div class="comment-detail">
            <div class="detail-top">
              <span class="left">
                <span class="name">{{item.user.nickname}}</span>
                <span class="date">{{item.time | toDate}}</span>
              </span>
              <span :class="['right', item.liked ? 'liked' : '']">
                {{item.likedCount}}
                <x-icon type="thumbsup" size="16" class="thumb"></x-icon>
              </span>
            </div>
            <p class="content">{{item.content}}</p>
          </div>
        </li>
      </ul>
      <div class="comment-type" v-if="commentData.hotComments">最新评论</div>
      <ul class="comment-list">
        <li :key="item.id" v-for="item in commentData.comments" class="comment-list-item">
          <router-link :to="`/user/${item.user.userId}`" class="avatar" :style="{backgroundImage: `url(${item.user.avatarUrl+'?param=38y38'})`}">
          </router-link>
          <div class="comment-detail">
            <div class="detail-top">
              <span class="left">
                <span class="name">{{item.user.nickname}}</span>
                <span class="date">{{item.time | toDate}}</span>
              </span>
              <span :class="['right', item.liked ? 'liked' : '']">
                {{item.likedCount}}
                <x-icon type="thumbsup" size="16" class="thumb"></x-icon>
              </span>
            </div>
            <p class="content">{{item.content}}</p>
          </div>
        </li>
      </ul>
      <loading-msg 
        :isLoading="loadingComment" 
        :isError="loadCommentError"
        :reloadFunc="getMoreComment"
      >
      </loading-msg>
    </div>
  </div>
</template>

<script>
import {
  getMusicComment,
  getPlayListComment,
  getAlbumComment
} from '@/api'

import { LOADING, LOADED, ERROR } from '@/constants'
import LoadingMsg from '../common/LoadingMsg'
import { XHeader } from 'vux'

export default {
  name: 'comments',
  data () {
    return {
      commentData: [],
      page: 0,
      limit: 20,
      typeArr: ['track', 'playlist', 'album'],
      loadState: {
        comment: LOADED
      },
      lastId: -1
    }
  },
  components: {
    XHeader,
    LoadingMsg
  },
  async activated () {
    const {id} = this.$route.query
    if (id !== this.lastId) {
      console.log('reload')
      this.lastId = id
      this.page = 0
      this.commentData = {}
      await this.getMoreComment()
    }
  },
  methods: {
    loadMore () {
      console.log('loading more')
    },
    async getMoreComment () {
      const {id, type} = this.$route.query
      const {limit, offset} = this
      let result = null

      this.loadState.comment = LOADING
      switch (type) {
        case 'track':
          result = await getMusicComment(id, limit, offset)
          break
        case 'playlist':
          result = await getPlayListComment(id, limit, offset)
          break
        case 'album':
          result = await getAlbumComment(id, limit, offset)
          break
        default:
          break
      }
      if (!result) {
        this.loadState.comment = ERROR
        return
      }
      let {comments, hotComments, total} = result.data
      console.log(result.data)
      if (!offset) {
        this.commentData = {
          comments,
          hotComments,
          total
        }
      } else {
        this.commentData.comments = this.commentData.comments.concat(comments)
      }
      this.loadState.comment = LOADED
      this.page++
    }
  },
  computed: {
    offset () {
      return this.limit * this.page
    },
    loadingComment () {
      return this.loadState.comment === LOADING
    },
    loadCommentError () {
      return this.loadState.comment === ERROR
    }
  },
  filters: {
    toDate (time) {
      const date = new Date(time)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/mixins';
@import '../../styles/theme';

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 499;
}

.wrapper {
  margin-top: 46px
}

.comment-list-item {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0.2rem 0 0.2rem;
}
.avatar {
  display: block;
  .circle(38px);
  flex-shrink: 0;
  background-repeat: no-repeat;
  background-size: cover;
}

.comment-detail {
  flex: 1;
  margin-left: 0.5rem;
  border-bottom: 1px solid @light-grey;
  .detail-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      .date {
        font-size: 10px;
        color: grey;
      }
    }
    .right {
      font-size: 12px;
      color: grey;
      &.liked {
        color: @theme-color;
        .thumb {
          fill: @theme-color;          
        }
      }
      .thumb {
        position: relative;
        top: 3px;
        fill: grey;
      }
    }
    
  }
  .content {
    padding: 0.5rem 0.5rem 0.5rem 0;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-all;
  }
}

.comment-type {
  padding: 4px;
  font-size: 12px;
  color: grey;
  background-color: @light-grey;
}
</style>
