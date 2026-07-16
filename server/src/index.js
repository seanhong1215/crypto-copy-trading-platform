// FinFolio 後端入口 / Express app
//
// 路由(前端經 webpack devServer proxy，/api 前綴會被去掉再打到這裡):
//   POST   /auth/register      註冊(bcrypt 雜湊 + 簽 JWT)
//   POST   /auth/login         登入(驗證 + 簽 JWT)
//   GET    /me                 目前使用者(需登入)
//   GET    /follows            我的跟單設定(需登入)
//   GET    /follows/pnl        Decimal 聚合損益(需登入)
//   PUT    /follows/:traderId  建立/更新跟單設定(需登入)
//   DELETE /follows/:traderId  取消跟單(需登入)

const express = require('express');
const cors = require('cors');
const db = require('./db');
const { hashPassword, verifyPassword, signToken, requireAuth } = require('./auth');
const { computePnl } = require('./pnl');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8888;
const MAX_TRADER_ID = 10;

function publicUser(row) {
  return { id: row.id, email: row.email, name: row.name };
}

// 把 DB 的 follows 列表整理成前端狀態的形狀:{ [traderId]: {...} }
function followsMap(userId) {
  const rows = db
    .prepare('SELECT * FROM follows WHERE user_id = ?')
    .all(userId);
  const map = {};
  for (const r of rows) {
    map[r.trader_id] = {
      copyMode: r.copy_mode,
      allocationUsd: Number(r.allocation_usd),
      stopLossPct: r.stop_loss_pct,
      followedAt: r.followed_at,
    };
  }
  return map;
}

// ---- 認證 / Auth ----

app.post('/auth/register', async (req, res) => {
  const { email, name, password } = req.body || {};
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) {
    return res.status(409).json({ error: 'email_taken' });
  }
  const password_hash = await hashPassword(password);
  const info = db
    .prepare(
      'INSERT INTO users (email, name, password_hash, created_at) VALUES (?, ?, ?, ?)'
    )
    .run(email, name || email, password_hash, new Date().toISOString());
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  return res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  return res.json({ token: signToken(user), user: publicUser(user) });
});

app.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'not_found' });
  return res.json({ user: publicUser(user) });
});

// ---- 跟單設定 / Follows ----

app.get('/follows', requireAuth, (req, res) => {
  return res.json(followsMap(req.userId));
});

app.get('/follows/pnl', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT trader_id, allocation_usd FROM follows WHERE user_id = ?')
    .all(req.userId);
  const follows = rows.map((r) => ({
    traderId: r.trader_id,
    allocationUsd: r.allocation_usd,
  }));
  return res.json(computePnl(follows));
});

app.put('/follows/:traderId', requireAuth, (req, res) => {
  const traderId = Number(req.params.traderId);
  if (!Number.isInteger(traderId) || traderId < 1 || traderId > MAX_TRADER_ID) {
    return res.status(400).json({ error: 'invalid_trader' });
  }
  const { copyMode, allocationUsd, stopLossPct } = req.body || {};
  const alloc = Number(allocationUsd);
  if (!['ratio', 'fixed'].includes(copyMode) || !(alloc > 0)) {
    return res.status(400).json({ error: 'invalid_input' });
  }
  const followedAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO follows (user_id, trader_id, copy_mode, allocation_usd, stop_loss_pct, followed_at)
     VALUES (@user_id, @trader_id, @copy_mode, @allocation_usd, @stop_loss_pct, @followed_at)
     ON CONFLICT(user_id, trader_id) DO UPDATE SET
       copy_mode = excluded.copy_mode,
       allocation_usd = excluded.allocation_usd,
       stop_loss_pct = excluded.stop_loss_pct,
       followed_at = excluded.followed_at`
  ).run({
    user_id: req.userId,
    trader_id: traderId,
    copy_mode: copyMode,
    // 以字串儲存精確金額,避免浮點
    allocation_usd: String(alloc),
    stop_loss_pct: Number(stopLossPct) || 0,
    followed_at: followedAt,
  });
  return res.json({
    traderId,
    copyMode,
    allocationUsd: alloc,
    stopLossPct: Number(stopLossPct) || 0,
    followedAt,
  });
});

app.delete('/follows/:traderId', requireAuth, (req, res) => {
  const traderId = Number(req.params.traderId);
  db.prepare('DELETE FROM follows WHERE user_id = ? AND trader_id = ?').run(
    req.userId,
    traderId
  );
  return res.status(204).end();
});

app.get('/health', (req, res) => res.json({ ok: true }));

// 只有直接執行(非被測試 require)時才啟動伺服器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[FinFolio] server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
