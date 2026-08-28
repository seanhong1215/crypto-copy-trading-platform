import traders from '@/data/mockTraders'

const USERS_KEY = 'finfolio_demo_users'
const FOLLOWS_KEY = 'finfolio_demo_follows'
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@finfolio.app',
  name: 'Demo Investor',
  password: 'demo123'
}
const DEMO_FOLLOWS = {
  1: { copyMode: 'ratio', allocationUsd: 1000, stopLossPct: -20, followedAt: '2026-07-01T08:00:00.000Z' },
  3: { copyMode: 'fixed', allocationUsd: 500, stopLossPct: -10, followedAt: '2026-07-01T08:05:00.000Z' }
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback
  } catch (e) {
    return fallback
  }
}

function users() {
  const saved = readJson(USERS_KEY, [])
  return [DEMO_USER].concat(saved.filter((user) => user.email !== DEMO_USER.email))
}

function currentEmail() {
  const info = readJson('USERINFO', null) || readJsonFromSession('USERINFO')
  return info && info.email
}

function readJsonFromSession(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch (e) {
    return null
  }
}

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name }
}

function authResult(user) {
  return {
    token: 'demo-session-' + user.id,
    user: publicUser(user)
  }
}

function followsByUser() {
  return readJson(FOLLOWS_KEY, {})
}

function getCurrentFollows() {
  const all = followsByUser()
  const email = currentEmail()
  if (!all[email] && email === DEMO_USER.email) {
    all[email] = Object.assign({}, DEMO_FOLLOWS)
    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(all))
  }
  return all[email] || {}
}

function saveCurrentFollows(follows) {
  const all = followsByUser()
  all[currentEmail()] = follows
  localStorage.setItem(FOLLOWS_KEY, JSON.stringify(all))
}

function demoError(code, status) {
  const error = new Error(code)
  error.code = code
  error.status = status
  return error
}

export const demoApi = {
  login({ email, password }) {
    const normalized = String(email || '').trim().toLowerCase()
    const user = users().find((item) => item.email === normalized && item.password === password)
    return user
      ? Promise.resolve(authResult(user))
      : Promise.reject(demoError('invalid_credentials', 401))
  },

  register({ email, name, password }) {
    const normalized = String(email || '').trim().toLowerCase()
    if (users().some((item) => item.email === normalized)) {
      return Promise.reject(demoError('email_taken', 409))
    }
    const user = {
      id: 'local-' + Date.now(),
      email: normalized,
      name: String(name || '').trim(),
      password
    }
    const saved = readJson(USERS_KEY, [])
    saved.push(user)
    localStorage.setItem(USERS_KEY, JSON.stringify(saved))
    return Promise.resolve(authResult(user))
  },

  getFollows() {
    return Promise.resolve(getCurrentFollows())
  },

  putFollow(traderId, payload) {
    const follows = getCurrentFollows()
    const follow = Object.assign({}, payload, { followedAt: new Date().toISOString() })
    follows[traderId] = follow
    saveCurrentFollows(follows)
    return Promise.resolve(Object.assign({ traderId }, follow))
  },

  deleteFollow(traderId) {
    const follows = getCurrentFollows()
    delete follows[traderId]
    saveCurrentFollows(follows)
    return Promise.resolve(null)
  },

  getPnl() {
    const follows = getCurrentFollows()
    const entries = Object.keys(follows).map((id) => {
      const trader = traders.find((item) => item.id === Number(id))
      const allocation = Number(follows[id].allocationUsd) || 0
      const returnPct = trader ? trader.monthReturnRatePct : 0
      return {
        traderId: Number(id),
        allocationUsd: allocation.toFixed(2),
        returnPct,
        pnlUsd: (allocation * returnPct / 100).toFixed(2)
      }
    })
    const aggregate = entries.reduce((sum, item) => sum + Number(item.pnlUsd), 0)
    const average = entries.length
      ? entries.reduce((sum, item) => sum + item.returnPct, 0) / entries.length
      : 0
    return Promise.resolve({
      aggregatePnlUsd: aggregate.toFixed(2),
      avgReturnPct: Number(average.toFixed(2)),
      count: entries.length,
      perTrader: entries
    })
  }
}
