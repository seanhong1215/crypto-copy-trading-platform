// 展示用的模擬交易員資料，為純前端靜態資料，不連接真實後端或交易所。
const CHART_COLORS = [
  'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)',
  'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)', 'var(--chart-8)'
]

const SYMBOLS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT']

// 使用簡單的偽隨機數產生器建立可重現的資金曲線，避免手動維護大量數值。
function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildEquityCurve(seed, startValue, trendPctPerDay, days = 30) {
  const rand = seededRandom(seed)
  const points = []
  let value = startValue
  const today = new Date('2026-07-01')
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const noise = (rand() - 0.5) * 0.02
    value = value * (1 + trendPctPerDay / 100 + noise)
    points.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value)
    })
  }
  return points
}

// 依月報酬率換算風險等級，避免逐筆指定。
function riskLevelFromReturn(pct) {
  const magnitude = Math.abs(pct)
  if (magnitude < 6) return 'low'
  if (magnitude < 16) return 'medium'
  return 'high'
}

function buildRecentTrades(seed, count = 7) {
  const rand = seededRandom(seed + 1)
  const trades = []
  for (let i = 0; i < count; i++) {
    const symbol = SYMBOLS[Math.floor(rand() * SYMBOLS.length)]
    const side = rand() > 0.5 ? 'buy' : 'sell'
    const volume = +(rand() * 2 + 0.05).toFixed(2)
    const pnlUsd = Math.round((rand() - 0.4) * 1500)
    trades.push({
      id: i + 1,
      symbol,
      side,
      time: `2026-07-0${(i % 9) + 1} ${8 + i}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60}`,
      volume,
      pnlUsd
    })
  }
  return trades
}

const seeds = [
  { id: 1, name: 'Nova Trader', initial: 'N', balance: 152300, monthReturn: 12.4, winRate: 68.4, followers: 342, trend: 0.4 },
  { id: 2, name: 'Kai Zhang', initial: 'K', balance: 88900, monthReturn: 7.1, winRate: 61.2, followers: 210, trend: 0.24 },
  { id: 3, name: 'Luna Ortiz', initial: 'L', balance: 264500, monthReturn: 21.8, winRate: 72.6, followers: 918, trend: 0.7 },
  { id: 4, name: 'Ethan Wu', initial: 'E', balance: 41200, monthReturn: -4.6, winRate: 44.8, followers: 56, trend: -0.16 },
  { id: 5, name: 'Mia Torres', initial: 'M', balance: 132700, monthReturn: 9.9, winRate: 65.0, followers: 401, trend: 0.33 },
  { id: 6, name: 'Byte Harper', initial: 'B', balance: 76300, monthReturn: 3.2, winRate: 55.5, followers: 128, trend: 0.1 },
  { id: 7, name: 'Zoe Nakamura', initial: 'Z', balance: 198400, monthReturn: 15.6, winRate: 69.9, followers: 640, trend: 0.5 },
  { id: 8, name: 'Sam Rivera', initial: 'S', balance: 29800, monthReturn: -8.2, winRate: 39.1, followers: 34, trend: -0.28 },
  { id: 9, name: 'Iris Chen', initial: 'I', balance: 115600, monthReturn: 6.4, winRate: 60.3, followers: 287, trend: 0.21 },
  { id: 10, name: 'Theo Marks', initial: 'T', balance: 305900, monthReturn: 18.3, winRate: 70.7, followers: 1024, trend: 0.6 },
]

const traders = seeds.map((seed, idx) => {
  const equityCurve = buildEquityCurve(seed.id * 17, seed.balance / (1 + seed.trend * 30 / 100), seed.trend)
  const recentTrades = buildRecentTrades(seed.id * 31)
  const totalProfitUsd = Math.round(equityCurve[equityCurve.length - 1].value - equityCurve[0].value)
  return {
    id: seed.id,
    name: seed.name,
    initial: seed.initial,
    avatarColor: CHART_COLORS[idx % CHART_COLORS.length],
    monthProfitUsd: Math.round(seed.balance * seed.monthReturn / 100),
    monthWinRatePct: seed.winRate,
    accountBalanceUsd: seed.balance,
    monthReturnRatePct: seed.monthReturn,
    riskLevel: riskLevelFromReturn(seed.monthReturn),
    dailyOrderCount: +(3 + (idx % 5) + Math.abs(seed.trend)).toFixed(1),
    followerCount: seed.followers,
    totalTrades: 400 + idx * 137,
    winRatePct: seed.winRate,
    totalProfitUsd,
    equityCurve,
    recentTrades
  }
})

export default traders
