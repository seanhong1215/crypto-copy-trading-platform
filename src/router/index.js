import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import i18n from '@/i18n/i18n'
import BasicLayout from '@/components/common/basic.vue'

const routes = [
  { path: '/login', component: () => import('@/components/login/login_new.vue'), meta: { title: 'login.menu' } },
  { path: '/register', component: () => import('@/components/login/register_new.vue'), meta: { title: 'register.menu' } },
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '', component: () => import('@/components/index_new.vue'), meta: { title: 'home.menu' } },
      { path: 'leaderboard', component: () => import('@/components/leaderboard/list.vue'), meta: { title: 'leaderboard.menu' } },
      { path: 'trader/:id', component: () => import('@/components/leaderboard/detail.vue'), meta: { title: 'trader_detail.menu' } },
      { path: 'following', component: () => import('@/components/following/dashboard.vue'), meta: { title: 'following.menu' } },
      { path: 'market', component: () => import('@/components/market/list.vue'), meta: { title: 'market.menu' } },
      { path: 'market/:id', component: () => import('@/components/market/detail.vue'), meta: { title: 'market_detail.menu' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(to => {
  NProgress.start()
  document.title = `${i18n.global.t(to.meta.title || 'home.menu')}｜FinFolio`
})
router.afterEach(() => NProgress.done())
router.onError(() => NProgress.done())

export default router
