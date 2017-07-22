import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyload from 'vue-lazyload'
import '@/util/rem'

Vue.config.productionTip = false
Vue.use(infiniteScroll)
Vue.use(VueLazyload)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
