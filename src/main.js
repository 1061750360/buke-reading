import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 引入字体图标
import './assets/iconfonts/icon.css'
// 引入样式文件
import './assets/styles/global.scss'
// 导入语言国际化包
import i18n from './lang/index'
// 导入懒加载
import VueLazyLoad from 'vue-lazyload'
import './mock/index'

Vue.prototype.$axios = axios

Vue.use(VueLazyLoad, {
  loading: require('./assets/images/lazyLoad.gif'), // 加载中图片，一定要有，不然会一直重复加载占位图
  error: require('./assets/images/error.jpg') // 加载失败图片
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
