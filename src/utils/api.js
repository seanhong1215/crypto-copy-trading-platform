// 後端 API 封裝 / Backend API client
//
// 後端模式會將請求送到同網域的 /api；GitHub Pages 預設使用 Demo adapter。
// token 直接從 sessionStorage 讀取(避免與 store 互相 import 造成循環相依)。

import { demoApi } from '@/utils/demoApi'

export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'
const BASE = '/api'

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = window.sessionStorage.getItem('TOKEN')
  if (token) headers.Authorization = 'Bearer ' + token

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  // 204 沒有內容
  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'request_failed_' + res.status)
    err.status = res.status
    err.code = data.error
    throw err
  }
  return data
}

const serverApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getFollows: () => request('/follows'),
  putFollow: (traderId, payload) =>
    request('/follows/' + traderId, { method: 'PUT', body: payload }),
  deleteFollow: (traderId) => request('/follows/' + traderId, { method: 'DELETE' }),
  getPnl: () => request('/follows/pnl')
}

// The portfolio defaults to a browser-only adapter in both development and
// production. Set VITE_DEMO_MODE=false only when an API server is available.
export const api = IS_DEMO_MODE ? demoApi : serverApi

export default api
