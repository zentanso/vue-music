import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
// code splitting
const PlayListDetail = () => import('@/pages/PlayListDetail')
const TrackDetail = () => import('@/pages/TrackDetail')
const Search = () => import('@/pages/Search')
const Comments = () => import('@/pages/Comments')
const Login = () => import('@/pages/Login')
const User = () => import('@/pages/User')

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
