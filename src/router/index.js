import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/book',
    component: () => import('../views/book/book.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/book/BookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    component: () => import('../views/store/Index.vue'),
    redirect: '/store/home',
    children: [
      {
        path: 'home',
        component: () => import('../views/store/StoreHome.vue'),
        meta: {
          keepAlive: true // 需要缓存
        }
      },
      {
        path: 'list',
        component: () => import('../views/store/BookList.vue'),
        meta: {
          keepAlive: false // 不需要缓存
        }
      },
      {
        name: 'detail',
        path: 'detail',
        component: () => import('../views/store/BookDetail.vue')
      },
      {
        path: 'shelf',
        component: () => import('../views/store/StoreShelf.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
