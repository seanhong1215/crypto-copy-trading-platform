//初始化时用sessionStorage存token，这样刷新页面就无需重新登录；
//followedTraders/readNotificationIds 用 localStorage，作为演示用的互动状态，跨分页/重开也保留

// 一次性迁移：把旧版的 followedTraderIds（纯 id 阵列）转成新的 followedTraders（带跟单设置的物件）
function loadFollowedTraders() {
    const existing = localStorage.getItem('followedTraders')
    if (existing) return JSON.parse(existing)

    const legacyIds = JSON.parse(localStorage.getItem('followedTraderIds') || '[]')
    const migrated = {}
    legacyIds.forEach((id) => {
        migrated[id] = {
            copyMode: 'ratio',
            allocationUsd: 500,
            stopLossPct: -20,
            followedAt: new Date().toISOString()
        }
    })
    if (legacyIds.length) {
        localStorage.setItem('followedTraders', JSON.stringify(migrated))
        localStorage.removeItem('followedTraderIds')
    }
    return migrated
}

const state = {
    USERID: window.sessionStorage.getItem('USERID') || null,
    TOKEN: window.sessionStorage.getItem('TOKEN') || null,
    USERINFO: JSON.parse(sessionStorage.getItem('USERINFO')), //用户信息对象
    followedTraders: loadFollowedTraders(), //跟单设置：{ [traderId]: {copyMode, allocationUsd, stopLossPct, followedAt} }
    readNotificationIds: JSON.parse(localStorage.getItem('readNotificationIds') || '[]'),
};

const mutations = {
    LOGIN: (state, data) => {
        state.TOKEN = data;
        window.sessionStorage.setItem('TOKEN', data);
    },
    LOGOUT: (state) => {
        state.TOKEN = null;
        state.USERINFO = null;
        window.sessionStorage.clear();
    },
    USERInfo: (state, data) => {
        state.USERINFO = data;
        window.sessionStorage.setItem('USERINFO', JSON.stringify(data));
    },
    FOLLOW_TRADER: (state, { traderId, copyMode, allocationUsd, stopLossPct }) => {
        Vue.set(state.followedTraders, traderId, {
            copyMode,
            allocationUsd,
            stopLossPct,
            followedAt: new Date().toISOString()
        });
        localStorage.setItem('followedTraders', JSON.stringify(state.followedTraders));
    },
    UNFOLLOW_TRADER: (state, traderId) => {
        Vue.delete(state.followedTraders, traderId);
        localStorage.setItem('followedTraders', JSON.stringify(state.followedTraders));
    },
    MARK_NOTIFICATIONS_READ: (state, ids) => {
        state.readNotificationIds = Array.from(new Set([...state.readNotificationIds, ...ids]));
        localStorage.setItem('readNotificationIds', JSON.stringify(state.readNotificationIds));
    },
};

export default new Vuex.Store({
    state,
    mutations,
});
