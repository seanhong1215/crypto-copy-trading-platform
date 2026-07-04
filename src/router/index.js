import basic from '@/components/common/basic'
import i18n from '@/i18n/i18n'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 登录
const login = () => import ( /* webpackChunkName: "group-login" */ '@/components/login/login_new');
// 注册
const register = () => import ( /* webpackChunkName: "group-register" */ '@/components/login/register_new');

//首页
const index = () => import ('@/components/index_new');
//排行榜
const leaderboardList = () => import ( /* webpackChunkName: "group-leaderboard" */ '@/components/leaderboard/list');
//交易员详情
const traderDetail = () => import ( /* webpackChunkName: "group-leaderboard" */ '@/components/leaderboard/detail');
//我的跟单
const followingDashboard = () => import ( /* webpackChunkName: "group-following" */ '@/components/following/dashboard');
//行情
const marketList = () => import ( /* webpackChunkName: "group-market" */ '@/components/market/list');
//行情详情（K线）
const marketDetail = () => import ( /* webpackChunkName: "group-market" */ '@/components/market/detail');

const router = new VueRouter({
    routes: [{
        path: '/login',
        name: '登录',
        meta: {
            title: 'login.menu',
        },
        component: login,
    },{
        path: '/register',
        name: '注册',
        meta: {
            title: 'register.menu',
        },
        component: register,
    },{
        path: '',
        component: basic,
        children: [{
            path: '/',
            name: '首页',
            meta: {
                title: 'home.menu',
            },
            component: index,
        },{
            path: '/leaderboard',
            name: '排行榜',
            meta: {
                title: 'leaderboard.menu',
            },
            component: leaderboardList,
        },{
            path: '/trader/:id',
            name: '交易员详情',
            meta: {
                title: 'trader_detail.menu',
            },
            component: traderDetail,
        },{
            path: '/following',
            name: '我的跟单',
            meta: {
                title: 'following.menu',
            },
            component: followingDashboard,
        },{
            path: '/market',
            name: '行情',
            meta: {
                title: 'market.menu',
            },
            component: marketList,
        },{
            path: '/market/:id',
            name: '行情详情',
            meta: {
                title: 'market_detail.menu',
            },
            component: marketDetail,
        }, {
            path: '*',
            redirect: '/'
        }]
    }],
    scrollBehavior() {
        return { x: 0, y: 0 }
    }
})

router.beforeEach((to, from, next) => {
    NProgress.start()
    document.title = i18n.tc(to.meta.title)
    next()
})

router.afterEach((to, from) => {
    NProgress.done()
})

export default router;
