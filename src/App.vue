<template>
  <div id="app">
    <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <my-audio></my-audio>
  </div>
</template>

<script>
import '@/styles/normalize.css'
import MyAudio from '@/components/MyAudio'

export default {
  name: 'app',
  components: {
    MyAudio
  },
  mounted () {
    if (window.localStorage.myid) {
      this.$store.commit('SET_MY_ID', {
        myid: window.localStorage.myid
      })
      this.$store.dispatch('getLikedList')
    }
  }
}
</script>

<style lang="less">

body {
  position: relative;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

a {
  text-decoration: none;
}

a:link,
a:visited,
a:hover,
a:active {
  color: #000;
}

.topbar-icon {
  top: -2px;
}

.vux-header h1 {
  text-align: left !important;
  margin: 0 60px !important;
}

.vux-x-icon {
  position: relative;
  fill: #fff;
}  

.content-wrapper {
  margin-top: 46px
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  // 组件并存期间会导致组件位置抖动，故设定position absolute
  transition: opacity .8s
}
.fade-enter-to {
  opacity: 1
}

.fade-leave-active, 
.fade-leave-to {
  opacity: 0;
}

@keyframes circling {
  0% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(180deg)    
  }
  100% {
    transform: rotate(360deg)
  }
}

.generate-animation(bar1, 0%, 100%);
.generate-animation(bar2, 100%, 50%);
.generate-animation(bar3, 30%, 90%);
.generate-animation(bar4, 60%, 30%);

.generate-animation(@name, @h1, @h2) {
  @keyframes @name {
    0% {
      height: @h1
    }
    50% {
      height: @h2
    }
    100% {
      height: @h1
    }
  }
}
</style>
