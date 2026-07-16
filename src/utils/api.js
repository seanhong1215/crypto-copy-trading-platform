// 後端 API 封裝 / Backend API client
//
// 所有請求走 /api 前綴，由 webpack devServer 的 proxy 轉發到後端(見 config/index.js)。
// token 直接從 sessionStorage 讀取(避免與 store 互相 import 造成循環相依)。

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

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getFollows: () => request('/follows'),
  putFollow: (traderId, payload) =>
    request('/follows/' + traderId, { method: 'PUT', body: payload }),
  deleteFollow: (traderId) => request('/follows/' + traderId, { method: 'DELETE' }),
  getPnl: () => request('/follows/pnl')
}

export default api
