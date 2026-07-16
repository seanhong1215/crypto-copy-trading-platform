// TOKEN/USERID/USERINFO 存 sessionStorage（跟着分页 session，登出即清）。
// followedTraders（跟单设置）改由「真实后端 + 资料库」提供，登入后透过 action 载入，
// 不再存 localStorage。readNotificationIds 仍留 localStorage（展示用互动状态，非本次后端化范围）。

import { api } from '@/utils/api'

const state = {
    USERID: window.sessionStorage.getItem('USERID') || null,
    TOKEN: window.sessionStorage.getItem('TOKEN') || null,
    USERINFO: JSON.parse(sessionStorage.getItem('USERINFO')), //用户信息对象
    followedTraders: {}, //跟单设置：{ [traderId]: {copyMode, allocationUsd, stopLossPct, followedAt} }，来自后端
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
        state.followedTraders = {};
        window.sessionStorage.clear();
    },
    USERInfo: (state, data) => {
        state.USERINFO = data;
        window.sessionStorage.setItem('USERINFO', JSON.stringify(data));
    },
    // 用后端回传的完整 map 取代本地状态（重新赋值根层级属性，Vue 2 会保持响应式）
    SET_FOLLOWS: (state, follows) => {
        state.followedTraders = follows || {};
    },
    SET_FOLLOW: (state, { traderId, follow }) => {
        // 物件动态 key，需用 Vue.set 才能触发响应式
        Vue.set(state.followedTraders, traderId, follow);
    },
    REMOVE_FOLLOW: (state, traderId) => {
        Vue.delete(state.followedTraders, traderId);
    },
    MARK_NOTIFICATIONS_READ: (state, ids) => {
        state.readNotificationIds = Array.from(new Set([...state.readNotificationIds, ...ids]));
        localStorage.setItem('readNotificationIds', JSON.stringify(state.readNotificationIds));
    },
};

const actions = {
    // 登入：呼叫后端验证 → 存 token/user → 载入该用户的跟单设定
    async login({ commit, dispatch }, { email, password }) {
        const { token, user } = await api.login({ email, password });
        commit('LOGIN', token);
        commit('USERInfo', user);
        await dispatch('loadFollows');
        return user;
    },
    // 注册：后端建立账号（bcrypt 雜湊）并直接签发 token（注册即登入）
    async register({ commit }, { email, name, password }) {
        const { token, user } = await api.register({ email, name, password });
        commit('LOGIN', token);
        commit('USERInfo', user);
        return user;
    },
    // 从后端载入跟单设定（登入后 / 重新整理带 token 时）
    async loadFollows({ commit }) {
        const follows = await api.getFollows();
        commit('SET_FOLLOWS', follows);
    },
    // 建立/更新跟单：后端 upsert → 用回传结果更新本地状态
    async followTrader({ commit }, { traderId, copyMode, allocationUsd, stopLossPct }) {
        const follow = await api.putFollow(traderId, { copyMode, allocationUsd, stopLossPct });
        commit('SET_FOLLOW', {
            traderId,
            follow: {
                copyMode: follow.copyMode,
                allocationUsd: follow.allocationUsd,
                stopLossPct: follow.stopLossPct,
                followedAt: follow.followedAt
            }
        });
    },
    // 取消跟单
    async unfollowTrader({ commit }, traderId) {
        await api.deleteFollow(traderId);
        commit('REMOVE_FOLLOW', traderId);
    }
};

export default new Vuex.Store({
    state,
    mutations,
    actions,
});
