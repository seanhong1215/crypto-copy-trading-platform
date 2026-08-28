import traders from '@/data/mockTraders'

// 從目前跟隨的交易員紀錄產生通知清單，不另外維護重複資料。
// 交易紀錄依時間由舊到新排列，因此從陣列尾端取得最新資料。
export function deriveNotifications(followedTraders) {
  const followedIds = Object.keys(followedTraders).map(Number)
  const list = []

  traders.forEach((trader) => {
    if (!followedIds.includes(trader.id)) return
    trader.recentTrades.slice(-2).reverse().forEach((trade) => {
      list.push({
        id: trader.id + '-' + trade.id,
        traderId: trader.id,
        traderName: trader.name,
        symbol: trade.symbol,
        side: trade.side,
        time: trade.time
      })
    })
  })

  return list.sort((a, b) => (a.time < b.time ? 1 : -1))
}
