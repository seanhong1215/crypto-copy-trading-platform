# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案簡介

FinFolio — 一個模擬加密貨幣交易所跟單排行榜的個人作品集網站（交易員排行榜、含損益圖表的交易員詳情頁、「我的跟单」儀表板、即時行情與 K 線、通知中心）。

**這個專案現在有一個真實後端**（`server/`，Node + Express + SQLite），負責三件事：(1) 真實認證（`bcrypt` 密碼雜湊 + JWT），(2) 跟單設定的持久化（每個 user 一份，存 SQLite），(3) 聚合損益以 `decimal.js` 計算。前端經 webpack devServer 的 proxy（`/api` → `http://localhost:8888`，且會去掉 `/api` 前綴）呼叫後端。詳見下方「後端」章節。

交易員本身的資料（績效／資金曲線／交易紀錄）**仍是模擬資料**，來自 `src/data/mockTraders.js`。真實串接的外部資料是 `/market` 與 `/market/:id`（呼叫 CoinGecko 公開 API 取得即時加密貨幣價格與 K 線）。介面上會區分「真實市場資料」與「模擬示例資料」，不要混淆。除非使用者明確要求，否則不要幫交易員相關頁面改接真實交易所資料。

## 常用指令

```bash
npm run dev     # 啟動 webpack-dev-server，port 8081（設定於 config/index.js），支援 hot reload
npm run build    # 打包到 dist/ 的正式環境版本（node build/build.js）
npm run build --report   # 正式環境打包 + 顯示 bundle analyzer 報告
```

前端沒有 linter，也沒有前端測試套件——不要自行編造前端的 `npm test`／`npm run lint`。**後端有測試**：`cd server && npm test`（Node 內建 test runner，跑 `server/test/pnl.test.js` 的 Decimal P&L 測試）。

開發時需要**同時啟動後端與前端**：
```bash
cd server && npm install && npm start   # 後端 Express，監聽 :8888
# 另開終端機
npm run dev                             # 前端 :8081，/api 自動 proxy 到 :8888
```

若只想確認程式碼能否編譯、不需要啟動 dev server：
```bash
npx webpack --config build/webpack.dev.conf.js
```

## 架構

### 技術棧
Vue 2.5（只用 Options API，沒有 Composition API）+ Vuex 3 + Vue Router 3 + Element UI 2.4 + ECharts，透過舊版 `vue-cli` webpack 樣板（`build/`、`config/` 目錄）打包，使用 webpack 3。

### 重要：核心函式庫是全域變數，不是 npm import
`Vue`、`Vuex`、`VueRouter`、`ELEMENT`（Element UI）、`echarts` 都是透過 `index.html` 裡的 `<script>` 標籤載入，並在整個程式碼庫中以**裸露的全域變數**形式使用——例如 `src/store/index.js` 直接呼叫 `new Vuex.Store(...)`，完全沒有 `import Vuex from 'vuex'`；圖表相關程式碼也是直接呼叫 `echarts.init(...)`。這些 script 實際載入的檔案是 `static/lib/` 底下的靜態檔案，不是 `node_modules` 裡鎖定版本的套件——不要假設 npm 裝的版本就是線上實際運作的版本。`static/lib/echarts.min.js` 目前是從 `node_modules/echarts/dist/echarts.min.js`（完整版）複製過去的，因為原本專案內建的是一個裁減過的精簡版本，沒有包含 K 線圖（candlestick）元件，会导致 `Component series.candlestick not exists` 的錯誤——之後如果升級／重新產生這個檔案，記得要用完整版而不是 `.common.js`／`.simple.js` 這類裁減版。整個專案已經沒有任何 `$ajax`／axios 的使用（`Vue.prototype.$ajax` 已移除），對外部資料的請求一律用原生 `fetch`（見 `src/utils/marketApi.js`）。

### 路由（`src/router/index.js`）
`/login` 與 `/register` 是頂層路由（沒有 navbar／footer）。其餘頁面都包在 `basic` 這個 layout 元件底下（`src/components/common/basic.vue` = navbar + `router-view` + footer）：`/`（首頁）、`/leaderboard`、`/trader/:id`、`/following`、`/market`、`/market/:id`（`id` 是 CoinGecko 的幣種代碼，例如 `bitcoin`）。**沒有路由層級的登入守衛**——`router.beforeEach` 只處理 `NProgress` 跟 `document.title`。登入攔截改成在「動作發生的當下」才擋，透過 `src/utils/requireLogin.js`（檢查 `store.state.TOKEN`，沒有的話跳出提示並導向 `/login`）。新增需要登入才能用的功能時，請沿用這個模式，不要另外加路由守衛。

### 狀態管理（`src/store/index.js`）
一個小而扁平的 Vuex store，沒有 modules／namespace，但**有 actions**。`TOKEN`／`USERID`／`USERINFO` 存在 `sessionStorage`（跟著分頁 session 走，登出就清除）。`readNotificationIds` 仍存 `localStorage`（展示用互動狀態，非本次後端化範圍）。

**`followedTraders` 已改為由後端提供**，不再存 localStorage：初始為 `{}`，登入後由 action 從後端載入。它仍是用交易員 id 當 key 的物件，每筆 `{copyMode, allocationUsd, stopLossPct, followedAt}`。相關流程走 **actions**（都呼叫 `src/utils/api.js`）：`login`／`register`（存 token + user，login 完會 `loadFollows`）、`loadFollows`（回填 `followedTraders`）、`followTrader`／`unfollowTrader`。對應 mutations 是 `SET_FOLLOWS`（整包取代）／`SET_FOLLOW`／`REMOVE_FOLLOW`——動態 key 一樣要用 `Vue.set`／`Vue.delete`。`main.js` 在啟動時若 `sessionStorage` 有 token 會 `dispatch('loadFollows')`，讓重新整理也能還原跟單。

`src/utils/api.js` 是後端 fetch 封裝：所有請求走 `/api` 前綴（proxy 到 :8888），token **直接從 `sessionStorage` 讀**（刻意不 import store，避免 `store ↔ api` 循環相依）。

### 跟單設定流程
排行榜／交易員詳情頁點「跟隨」不是直接切換，而是先跳出 `src/components/leaderboard/copySettingsModal.vue`（`el-dialog`，設定跟單模式／分配金額／止損比例），確認後才 `dispatch('followTrader')`（呼叫後端 `PUT /follows/:id`）。已跟隨的狀態下點擊會 `dispatch('unfollowTrader')`（`DELETE /follows/:id`），不會再跳窗。`card.vue`／`detail.vue` 各自持有 `showCopyModal` 開關；`el-dialog` 務必保留 `append-to-body="true"`，否則對話框裡的點擊會被卡片本身的 `@click="goDetail"` 誤觸發導航。

### 後端（`server/`，Node + Express + SQLite）
`server/src/` 下：`db.js`（better-sqlite3，`users`／`follows` 兩張表；金額欄位 `allocation_usd` 以 **TEXT 存精確小數字串**，不用 REAL 浮點）、`auth.js`（`bcryptjs` 雜湊、`jsonwebtoken` 簽發/驗證、`requireAuth` 中介層）、`pnl.js`（**用 `decimal.js` 算聚合損益**，交易員報酬率是後端權威 seed `TRADER_RETURNS`，不信任前端傳入的數字）、`index.js`（Express 路由）。端點：`POST /auth/register`、`POST /auth/login`、`GET /me`、`GET/PUT/DELETE /follows[/:traderId]`、`GET /follows/pnl`。前端經 proxy 打 `/api/*`，`/api` 前綴會被去掉。`server/test/pnl.test.js` 用 Node 內建 test runner 覆蓋 P&L（含浮點誤差情境）。DB 檔在 `server/data/`（已 gitignore）。改金額相關邏輯時務必維持「TEXT 儲存 + decimal.js 運算」，不要退回浮點。

### 即時行情與 K 線（`src/utils/marketApi.js`、`src/components/market/`）
`fetchMarketPrices()` 呼叫 CoinGecko `/simple/price`（免費、不需金鑰）一次拿 BTC/ETH/SOL/BNB/XRP 的價格與 24h 漲跌，`market/list.vue` 每 45 秒自動輪詢＋手動刷新按鈕，背景刷新失敗時保留舊資料只加提示文字，不會整頁清空。`fetchOhlc()` 呼叫 `/coins/{id}/ohlc` 拿 K 線資料，**回傳格式是 `[時間戳,開,高,低,收]`，但 ECharts candlestick 需要的順序是 `[開,收,低,高]`**——`market/detail.vue` 的 `renderChart()` 裡有做這個重新排列，之後如果動到這段邏輯要小心順序別搞錯。

### 通知中心（`src/utils/notifications.js`、`src/components/common/notificationBell.vue`）
通知內容不是寫死的清單，而是從「目前跟隨的交易員」的 `recentTrades` 動態衍生出來（`deriveNotifications()`）。`mockTraders.js` 裡的 `recentTrades` 是「時間由舊到新」排列，取最新的要用 `.slice(-2).reverse()`，不要從陣列開頭取。已讀狀態存在 `readNotificationIds`（見上面狀態管理）。

### 多語系（`src/i18n/`）
`vue-i18n` 有安裝並設定好，但多語系功能目前刻意停用——`src/i18n/i18n.js` 只 import 並載入 `zh_CN.js`，介面上也沒有語言切換的 UI。新增的介面文案請只加在 `zh_CN.js` 裡；除非使用者要求，否則不要重新加回 `en.js` 或語言切換功能。

### 模擬資料（`src/data/mockTraders.js`）
10 位交易員的資料是從一個小型的 `seeds` 陣列，搭配一個帶種子的線性同餘法亂數產生器（`seededRandom`）產生出來的，這樣每次重新整理頁面時資金曲線／交易紀錄都會是同一組（可重現）。`riskLevel`（風險等級）是透過 `riskLevelFromReturn()` 依 `monthReturnRatePct` 的絕對值換算出來的，不是手動填寫的。之後如果要新增欄位，盡量比照這個做法用既有的 seed 資料換算出來，不要為每位交易員手動寫死數值。

### 顏色 token（`src/assets/css/common_styles.css` 的 `:root`）
顏色都定義成 CSS 自訂屬性（`--brand-primary`、`--surface-page`／`--surface-card`、`--ink-primary`／`--ink-secondary`／`--ink-muted`、盈虧用的 `--color-good`／`--color-critical`、圖表分類色 `--chart-1` 到 `--chart-8` 等），元件都用這些 token 寫樣式（`var(--brand-primary)` 等）。**新元件請不要寫死十六進位色碼**，一律使用現有的 token 名稱。網站目前固定使用亮色主題（先前實驗過的深色模式已完整移除）。

**ECharts 是唯一一個 token 不會自動生效的地方**：canvas 繪圖沒辦法直接讀取 `var()`，所以圖表的顏色設定必須在渲染當下透過 `src/utils/chartTheme.js`（`cssVar(el, '--token名稱')`，內部用 `getComputedStyle` 解析）取得實際顏色值。可以參考 `src/components/leaderboard/detail.vue`、`src/components/following/dashboard.vue` 或 `src/components/market/detail.vue` 的寫法。

**已知的坑**：`src/assets/css/elmentuiReset.less`（LESS 檔）裡的巢狀規則在這個專案的 webpack／less-loader 設定下，並不保證會被編譯進最終產出的 CSS——即使 webpack 回報編譯成功也一樣（曾經實測過針對 `#app.theme-dark .el-table` 的巢狀覆寫完全沒有出現在編譯後的 CSS 裡）。Element UI 的樣式覆寫請優先寫在 `common_styles.css`（純 CSS，非 LESS）裡。如果幫 Element UI 元件加樣式看起來沒有生效，先確認那條規則有沒有真的出現在編譯後的 CSS 裡（可以在瀏覽器檢查 `document.styleSheets`），不要一開始就假設是 specificity（選擇器優先順序）的問題。

### 首頁地球元件（`src/components/index_new.vue`）的坑
首頁有一個用第三方 WebGL 套件（`static/lib/miniature.earth.core.js`）畫的旋轉地球。這個套件對其祖先元素的背景很敏感——只要 `#app` 或首頁元件自己的根節點被設成不透明的 `background`，地球就會完全畫不出來（canvas 存在、尺寸正確，但沒有任何內容被畫上去），原因不明，只確認是背景屬性造成的。如果之後需要讓首頁背景動態變化，不要直接在 `#app` 或這個元件的根節點上加 `background`，改用 `document.body` 或其他不在地球元件祖先鏈上的節點。

### 值得知道的共用元件
- `src/components/leaderboard/card.vue` — 交易員卡片，排行榜清單、「我的跟单」儀表板清單共用同一份。之後如果有新的交易員清單畫面，請重複使用這個元件，不要重新刻一份卡片樣板。
- `src/components/leaderboard/copySettingsModal.vue` — 跟單設定彈窗，`card.vue`／`detail.vue` 共用。
- `src/components/common/notificationBell.vue` — 導覽列的通知鈴鐺，只在已登入時顯示（桌面版）。
- `src/utils/requireLogin.js` — 目前唯一的登入攔截機制；任何新增的、需要登入才能執行的動作都應該包在這個函式裡。
- `src/utils/chartTheme.js` — `cssVar()`／`resolveAvatarColor()`，用來取得圖表顏色。
- `src/utils/marketApi.js` — CoinGecko API 的 `fetch` 封裝（價格、K 線）。

### ECharts 尺寸相關的坑
如果在 `mounted()`／`$nextTick` 裡呼叫 `echarts.init()`，有可能會在版面還沒完全穩定時就抓到過小的容器寬度，導致圖表畫出來整個擠在畫面最左邊一小塊。現有的圖表渲染方法都會在 `setOption()` 之後緊接著呼叫 `this.chart.resize()`，強制重新量測容器尺寸——之後新增圖表時請保留這個呼叫。
