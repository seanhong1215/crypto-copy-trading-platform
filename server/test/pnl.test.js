// Decimal P&L 單元測試 / 使用 Node 內建 test runner(免額外依賴)
// 執行:npm test  (等同 node --test)

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { computePnl } = require('../src/pnl');

test('單一跟單:P&L = 配置金額 × 報酬率', () => {
  // 交易員 1 月報酬 12.4%，配置 1000 → 124.00
  const r = computePnl([{ traderId: 1, allocationUsd: '1000' }]);
  assert.equal(r.aggregatePnlUsd, '124.00');
  assert.equal(r.avgReturnPct, 12.4);
  assert.equal(r.count, 1);
});

test('負報酬交易員產生負損益', () => {
  // 交易員 4 月報酬 -4.6%，配置 500 → -23.00
  const r = computePnl([{ traderId: 4, allocationUsd: '500' }]);
  assert.equal(r.aggregatePnlUsd, '-23.00');
  assert.equal(r.avgReturnPct, -4.6);
});

test('多筆聚合並計算平均報酬', () => {
  const r = computePnl([
    { traderId: 1, allocationUsd: '1000' }, // +124.00 (12.4%)
    { traderId: 4, allocationUsd: '500' }, //  -23.00 (-4.6%)
  ]);
  assert.equal(r.aggregatePnlUsd, '101.00');
  assert.equal(r.avgReturnPct, 3.9); // (12.4 + -4.6)/2
  assert.equal(r.count, 2);
});

test('避免浮點誤差:0.1 + 0.2 場景', () => {
  // 建構讓損益恰為 0.10 與 0.20 的情況並相加，結果必須精確為 0.30
  // 報酬率設 10% → 配置 1 → 0.10；配置 2 → 0.20
  const r = computePnl(
    [
      { traderId: 100, allocationUsd: '1' },
      { traderId: 200, allocationUsd: '2' },
    ],
    { 100: 10, 200: 10 }
  );
  assert.equal(r.aggregatePnlUsd, '0.30'); // 浮點會是 0.30000000000000004
});

test('空跟單回傳 0', () => {
  const r = computePnl([]);
  assert.equal(r.aggregatePnlUsd, '0.00');
  assert.equal(r.avgReturnPct, 0);
  assert.equal(r.count, 0);
});

test('perTrader 每筆帶精確金額與報酬率', () => {
  const r = computePnl([{ traderId: 3, allocationUsd: '250' }]); // 21.8%
  assert.deepEqual(r.perTrader[0], {
    traderId: 3,
    allocationUsd: '250.00',
    returnPct: 21.8,
    pnlUsd: '54.50',
  });
});
