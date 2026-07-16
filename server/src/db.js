// SQLite 資料庫初始化 / Database bootstrap
//
// 用 better-sqlite3(同步 API、零外部服務、單檔資料庫),適合作品集展示。
// 金額(allocation_usd)以 TEXT 儲存精確小數字串,不用 REAL 浮點,
// 計算時再交給 decimal.js(見 pnl.js)。

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'finfolio.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS follows (
    user_id       INTEGER NOT NULL,
    trader_id     INTEGER NOT NULL,
    copy_mode     TEXT NOT NULL,
    allocation_usd TEXT NOT NULL,   -- 精確小數字串，避免浮點
    stop_loss_pct INTEGER NOT NULL,
    followed_at   TEXT NOT NULL,
    PRIMARY KEY (user_id, trader_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
