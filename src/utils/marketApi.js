// 串接 CoinGecko 公開 API（不需金鑰），取得真實的加密貨幣行情資料
const BASE = 'https://api.coingecko.com/api/v3'

// 對應 mockTraders.js 裡使用的交易對符號到 CoinGecko 的幣種 id
export const MARKET_SYMBOLS = [
  { symbol: 'BTC/USDT', id: 'bitcoin' },
  { symbol: 'ETH/USDT', id: 'ethereum' },
  { symbol: 'SOL/USDT', id: 'solana' },
  { symbol: 'BNB/USDT', id: 'binancecoin' },
  { symbol: 'XRP/USDT', id: 'ripple' }
]

export const SYMBOL_TO_COINGECKO_ID = MARKET_SYMBOLS.reduce((map, item) => {
  map[item.symbol] = item.id
  return map
}, {})

function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

// 取得目前價格與 24 小時漲跌幅
export async function fetchMarketPrices() {
  const ids = MARKET_SYMBOLS.map((s) => s.id).join(',')
  const url = `${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`

  const res = await fetchWithTimeout(url, 8000)
  if (!res.ok) throw new Error('market_fetch_failed_' + res.status)
  const data = await res.json()

  return MARKET_SYMBOLS.map(({ symbol, id }) => {
    const entry = data[id]
    if (!entry) throw new Error('market_fetch_missing_' + id)
    return {
      symbol,
      price: entry.usd,
      change24hPct: entry.usd_24h_change
    }
  })
}

// 取得指定幣種的 K 線（OHLC）資料，days: 1 | 7 | 30
export async function fetchOhlc(coinId, days) {
  const url = `${BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
  const res = await fetchWithTimeout(url, 8000)
  if (!res.ok) throw new Error('ohlc_fetch_failed_' + res.status)
  return res.json()
}
