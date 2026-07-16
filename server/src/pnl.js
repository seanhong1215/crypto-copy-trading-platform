// 跟單損益計算(高精度) / Copy-trading P&L with decimal precision
//
// 為什麼不用 JavaScript 浮點:金額運算的誤差會累積(0.1 + 0.2 !== 0.3)。
// 使用者對每位交易員配置 allocationUsd,其跟單損益 = 配置金額 × 月報酬率。
// 這裡全程用 decimal.js,並以字串輸入/輸出金額,確保聚合結果精確可對帳。
//
// 交易員月報酬率為後端權威資料(TRADER_RETURNS),不信任前端傳入的數字。

const Decimal = require('decimal.js');

// 交易員月報酬率(%),與前端 mockTraders 的 monthReturn 對應。
const TRADER_RETURNS = {
  1: 12.4, 2: 7.1, 3: 21.8, 4: -4.6, 5: 9.9,
  6: 3.2, 7: 15.6, 8: -8.2, 9: 6.4, 10: 18.3,
};

/**
 * 依使用者的跟單設定計算聚合損益。
 * @param {Array<{traderId:number, allocationUsd:string|number}>} follows
 * @param {Record<number, number>} [returns] 交易員報酬率表(預設用權威 seed)
 * @returns {{aggregatePnlUsd:string, avgReturnPct:number, count:number, perTrader:Array}}
 */
function computePnl(follows, returns = TRADER_RETURNS) {
  let aggregate = new Decimal(0);
  let returnSum = new Decimal(0);

  const perTrader = follows.map((f) => {
    const alloc = new Decimal(f.allocationUsd);
    const pct = new Decimal(returns[f.traderId] != null ? returns[f.traderId] : 0);
    const pnl = alloc.mul(pct).div(100);
    aggregate = aggregate.plus(pnl);
    returnSum = returnSum.plus(pct);
    return {
      traderId: f.traderId,
      allocationUsd: alloc.toFixed(2),
      returnPct: pct.toNumber(),
      pnlUsd: pnl.toFixed(2),
    };
  });

  const count = follows.length;
  const avgReturnPct = count
    ? returnSum.div(count).toDecimalPlaces(2).toNumber()
    : 0;

  return {
    aggregatePnlUsd: aggregate.toFixed(2),
    avgReturnPct,
    count,
    perTrader,
  };
}

module.exports = { computePnl, TRADER_RETURNS };
