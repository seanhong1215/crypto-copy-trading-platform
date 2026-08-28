import { createStore } from 'vuex'
import { api } from '@/utils/api'

const readJson = (storage, key, fallback) => {
  try {
    return JSON.parse(storage.getItem(key) || JSON.stringify(fallback))
  } catch (_) {
    return fallback
  }
}

export default createStore({
  state: {
    USERID: window.sessionStorage.getItem('USERID') || null,
    TOKEN: window.sessionStorage.getItem('TOKEN') || null,
    USERINFO: readJson(window.sessionStorage, 'USERINFO', null),
    followedTraders: {},
    readNotificationIds: readJson(window.localStorage, 'readNotificationIds', [])
  },
  mutations: {
    LOGIN(state, token) {
      state.TOKEN = token
      window.sessionStorage.setItem('TOKEN', token)
    },
    LOGOUT(state) {
      state.TOKEN = null
      state.USERINFO = null
      state.followedTraders = {}
      window.sessionStorage.clear()
    },
    USERInfo(state, user) {
      state.USERINFO = user
      window.sessionStorage.setItem('USERINFO', JSON.stringify(user))
    },
    SET_FOLLOWS(state, follows) {
      state.followedTraders = follows || {}
    },
    SET_FOLLOW(state, { traderId, follow }) {
      state.followedTraders[traderId] = follow
    },
    REMOVE_FOLLOW(state, traderId) {
      delete state.followedTraders[traderId]
    },
    MARK_NOTIFICATIONS_READ(state, ids) {
      state.readNotificationIds = [...new Set([...state.readNotificationIds, ...ids])]
      window.localStorage.setItem('readNotificationIds', JSON.stringify(state.readNotificationIds))
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      const { token, user } = await api.login(credentials)
      commit('LOGIN', token)
      commit('USERInfo', user)
      await dispatch('loadFollows')
      return user
    },
    async register({ commit }, profile) {
      const { token, user } = await api.register(profile)
      commit('LOGIN', token)
      commit('USERInfo', user)
      return user
    },
    async loadFollows({ commit }) {
      commit('SET_FOLLOWS', await api.getFollows())
    },
    async followTrader({ commit }, { traderId, copyMode, allocationUsd, stopLossPct }) {
      const follow = await api.putFollow(traderId, { copyMode, allocationUsd, stopLossPct })
      commit('SET_FOLLOW', { traderId, follow })
    },
    async unfollowTrader({ commit }, traderId) {
      await api.deleteFollow(traderId)
      commit('REMOVE_FOLLOW', traderId)
    }
  }
})
