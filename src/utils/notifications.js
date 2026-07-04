import traders from '@/data/mockTraders'

// 从「目前跟随的交易员」的模拟交易纪录衍生出通知清单，不是另外写死一份通知资料
// mockTraders.js 里的交易纪录是依时间由旧到新排列，取最新的要从阵列尾端取
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
