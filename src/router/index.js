import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import PlayListDetail from '@/pages/PlayListDetail'
import TrackDetail from '@/pages/TrackDetail'
import Search from '@/pages/Search'
import Comments from '@/pages/Comments'
import Login from '@/pages/Login'
import User from '@/pages/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home/recommend'
    },
    {
      path: '/home/:tab',
      component: Home
    },
    {
      path: '/playlistdetail/:id',
      component: PlayListDetail
    },
    {
      path: '/trackdetail',
      component: TrackDetail
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/comments',
      component: Comments
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/user/:id',
      component: User
    }
  ]
})
