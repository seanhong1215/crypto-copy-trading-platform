# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案簡介

FinFolio — 一個模擬加密貨幣交易所跟單排行榜的個人作品集網站（交易員排行榜、含損益圖表的交易員詳情頁、「我的跟单」儀表板、即時行情與 K 線、通知中心）。這是一個**沒有真實後端**的專案：交易員／排行榜／損益資料都來自 `src/data/mockTraders.js`，登入／註冊接受任何帳密（模擬驗證）。唯一真實串接的外部資料是 `/market` 與 `/market/:id`（呼叫 CoinGecko 公開 API 取得即時加密貨幣價格與 K 線），這兩頁的介面文案會明確標示「真實市場資料」，跟其餘頁面「模擬示例資料」的聲明區分開來，不要混淆兩者。除非使用者明確要求，否則不要幫其餘頁面加上真實 API 串接。

## 常用指令

```bash
npm run dev     # 啟動 webpack-dev-server，port 8081（設定於 config/index.js），支援 hot reload
npm run build    # 打包到 dist/ 的正式環境版本（node build/build.js）
npm run build --report   # 正式環境打包 + 顯示 bundle analyzer 報告
```

這個 repo 沒有設定測試套件，也沒有設定 linter——不要自行編造 `npm test` 或 `npm run lint` 這類指令。

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
一個小而扁平的 Vuex store，沒有 modules／namespace。`TOKEN`／`USERID`／`USERINFO` 存在 `sessionStorage`（跟著分頁 session 走，登出就清除）。`followedTraders`／`readNotificationIds` 存在 `localStorage`（跨 session 保留——這些是使用者偏好／展示用的互動狀態，不是登入驗證資訊）。之後如果有新的東西需要持久化，請沿用同樣的「初始 state 從 storage 讀回來、mutation 裡寫回 storage」的模式。

`followedTraders` 是用交易員 id 當 key 的物件（不是純 id 陣列），每筆存 `{copyMode, allocationUsd, stopLossPct, followedAt}`——這是模擬「跟單設定」而不是單純一鍵跟隨。`store/index.js` 裡的 `loadFollowedTraders()` 會把舊版（純 id 陣列的 `followedTraderIds`）一次性遷移成新格式，之後不會再有這個 key，不用特別處理相容性。物件的新增／刪除用 `FOLLOW_TRADER`／`UNFOLLOW_TRADER` 兩個 mutation，因為是物件的動態 key，內部要用全域 `Vue.set`／`Vue.delete` 才能觸發響應式更新。

### 跟單設定流程
排行榜／交易員詳情頁點「跟隨」不是直接切換，而是先跳出 `src/components/leaderboard/copySettingsModal.vue`（`el-dialog`，設定跟單模式／分配金額／止損比例），確認後才 commit `FOLLOW_TRADER`。已跟隨的狀態下點擊會直接 `UNFOLLOW_TRADER`，不會再跳窗。`card.vue`／`detail.vue` 各自持有 `showCopyModal` 開關；`el-dialog` 務必保留 `append-to-body="true"`，否則對話框裡的點擊會被卡片本身的 `@click="goDetail"` 誤觸發導航。

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
