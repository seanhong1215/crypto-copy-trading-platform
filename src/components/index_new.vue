<template>
  <main class="home-page">
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> PORTFOLIO DEMO · COPY TRADING</div>
          <h1>用清楚的績效資料，<br />建立你的跟單組合</h1>
          <p class="hero-lead">比較交易員報酬、勝率與風險，設定配置金額與停損條件，在同一個看板追蹤模擬投資組合。</p>
          <div class="hero-actions">
            <router-link to="/leaderboard" class="primary-action">瀏覽交易員</router-link>
            <router-link :to="isLoggedIn ? '/following' : '/login'" class="secondary-action">
              {{ isLoggedIn ? '查看我的組合' : '使用 Demo 帳號' }}
            </router-link>
          </div>
          <div class="hero-trust">
            <span><i>✓</i> 不連接真實交易所</span>
            <span><i>✓</i> 不會產生真實訂單</span>
          </div>
        </div>

        <div class="portfolio-preview" aria-label="模擬投資組合預覽">
          <div class="preview-head">
            <div><span class="preview-label">模擬組合價值</span><strong>$18,642.80</strong></div>
            <span class="live-pill"><i></i> Demo data</span>
          </div>
          <div class="return-row"><span>本月損益</span><strong>+$1,284.20 <small>+7.4%</small></strong></div>
          <div class="chart-area" aria-hidden="true">
            <div class="chart-grid line-one"></div><div class="chart-grid line-two"></div>
            <svg viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs><linearGradient id="home-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#2a78d6" stop-opacity="0.24" /><stop offset="100%" stop-color="#2a78d6" stop-opacity="0" /></linearGradient></defs>
              <path class="area" d="M0,150 C45,144 66,122 105,128 C150,136 174,92 215,104 C260,116 282,62 323,73 C368,85 405,36 500,22 L500,180 L0,180 Z" />
              <path class="line" d="M0,150 C45,144 66,122 105,128 C150,136 174,92 215,104 C260,116 282,62 323,73 C368,85 405,36 500,22" />
            </svg>
          </div>
          <div class="preview-list">
            <div><span class="avatar blue">N</span><span><b>Nova Trader</b><small>配置 $1,000</small></span><strong>+12.4%</strong></div>
            <div><span class="avatar green">L</span><span><b>Luna Ortiz</b><small>配置 $500</small></span><strong>+21.8%</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="metrics-strip">
      <div class="container metrics-grid">
        <div><strong>10</strong><span>位模擬交易員</span></div><div><strong>3</strong><span>種風險等級</span></div>
        <div><strong>24/7</strong><span>公開市場行情</span></div><div><strong>100%</strong><span>作品集展示用途</span></div>
      </div>
    </section>

    <section class="feature-section">
      <div class="container">
        <div class="section-heading"><span>從研究到追蹤</span><h2>三個步驟完成模擬跟單</h2><p>每一步都保留足夠資訊，讓決策不只看單一報酬數字。</p></div>
        <div class="feature-grid">
          <article><span class="step">01</span><div class="feature-icon"><i>↗</i></div><h3>比較交易員</h3><p>依月報酬、勝率、跟隨人數與風險等級篩選合適的交易員。</p></article>
          <article><span class="step">02</span><div class="feature-icon"><i>◎</i></div><h3>設定跟單條件</h3><p>選擇比例或固定金額模式，設定配置金額與模擬停損比例。</p></article>
          <article><span class="step">03</span><div class="feature-icon"><i>◒</i></div><h3>追蹤組合</h3><p>在個人看板查看聚合損益、平均報酬與各交易員資金曲線。</p></article>
        </div>
      </div>
    </section>

    <section class="demo-note">
      <div class="container note-card">
        <div class="note-icon">i</div>
        <div><strong>資料透明聲明</strong><p>交易員績效與跟單結果為可重現的模擬資料；行情頁使用 CoinGecko 公開 API。本站不提供投資建議或真實交易服務。</p></div>
        <router-link to="/leaderboard">開始體驗 <i>→</i></router-link>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    isLoggedIn() {
      return !!this.$store.state.TOKEN
    }
  }
}
</script>

<style scoped>
.home-page { background: #fff; color: var(--ink-primary); }
.hero-section { padding: 148px 0 88px; background: linear-gradient(135deg, #f7faff 0%, #fff 52%, #f2fbf7 100%); overflow: hidden; }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(420px, .95fr); gap: 72px; align-items: center; }
.eyebrow { color: var(--brand-primary); font-size: 12px; font-weight: 700; letter-spacing: 1.4px; margin-bottom: 22px; }
.eyebrow span { display: inline-block; width: 26px; height: 2px; background: var(--brand-primary); vertical-align: middle; margin-right: 10px; }
.hero-copy h1 { margin: 0; font-size: 48px; line-height: 1.22; letter-spacing: -1.8px; color: #122039; }
.hero-lead { max-width: 580px; margin: 24px 0 30px; color: #5c687c; font-size: 17px; line-height: 1.9; }
.hero-actions { display: flex; gap: 12px; margin-bottom: 24px; }
.hero-actions a { min-width: 150px; padding: 13px 22px; border-radius: 8px; text-align: center; font-size: 14px; font-weight: 600; text-decoration: none; transition: .18s ease; }
.primary-action { background: var(--brand-primary); color: #fff; box-shadow: 0 8px 20px rgba(42,120,214,.2); }
.primary-action:hover { background: var(--brand-primary-hover); color: #fff; transform: translateY(-1px); }
.secondary-action { background: #fff; color: #24334b; border: 1px solid #d6deea; }
.secondary-action:hover { color: var(--brand-primary); border-color: var(--brand-primary); }
.hero-trust { display: flex; flex-wrap: wrap; gap: 20px; color: #7c8798; font-size: 12px; }
.hero-trust i { color: var(--color-good); margin-right: 5px; font-weight: 700; }
.portfolio-preview { position: relative; background: rgba(255,255,255,.94); border: 1px solid #e1e8f2; border-radius: 18px; padding: 26px; box-shadow: 0 24px 70px rgba(35,62,99,.14); }
.portfolio-preview:before { content: ''; position: absolute; width: 240px; height: 240px; right: -90px; top: -100px; border-radius: 50%; background: rgba(27,175,122,.08); z-index: -1; }
.preview-head, .return-row { display: flex; align-items: flex-start; justify-content: space-between; }
.preview-label { display: block; color: #7c8798; font-size: 12px; margin-bottom: 6px; }
.preview-head strong { display: block; color: #122039; font-size: 27px; letter-spacing: -.5px; }
.live-pill { color: #51705f; background: #eaf8f1; padding: 6px 10px; border-radius: 20px; font-size: 11px; }
.live-pill i { display: inline-block; width: 6px; height: 6px; background: #1baf7a; border-radius: 50%; margin-right: 5px; }
.return-row { margin-top: 24px; font-size: 12px; color: #7c8798; }
.return-row strong { color: var(--color-good); font-size: 14px; }.return-row small { margin-left: 6px; font-weight: 500; }
.chart-area { height: 176px; position: relative; margin: 10px 0 18px; border-bottom: 1px solid #eef1f5; }
.chart-area svg { width: 100%; height: 100%; position: relative; z-index: 2; }.chart-area .area { fill: url(#home-chart-fill); }.chart-area .line { fill: none; stroke: var(--brand-primary); stroke-width: 3; stroke-linecap: round; }
.chart-grid { position: absolute; left: 0; right: 0; border-top: 1px dashed #e8edf3; }.chart-grid.line-one { top: 34%; }.chart-grid.line-two { top: 68%; }
.preview-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }.preview-list > div { display: flex; align-items: center; padding: 11px; background: #f7f9fc; border-radius: 9px; }
.avatar { width: 32px; height: 32px; display: grid; place-items: center; color: #fff; border-radius: 50%; font-weight: 700; margin-right: 9px; }.avatar.blue { background: #2a78d6; }.avatar.green { background: #1baf7a; }
.preview-list span:nth-child(2) { min-width: 0; flex: 1; }.preview-list b, .preview-list small { display: block; }.preview-list b { font-size: 12px; color: #24334b; white-space: nowrap; }.preview-list small { color: #8a94a5; font-size: 10px; margin-top: 2px; }.preview-list > div > strong { color: var(--color-good); font-size: 12px; }
.metrics-strip { border-top: 1px solid #edf0f4; border-bottom: 1px solid #edf0f4; }.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); padding-top: 27px; padding-bottom: 27px; }
.metrics-grid div { text-align: center; border-right: 1px solid #e5e9ef; }.metrics-grid div:last-child { border: 0; }.metrics-grid strong { display: block; color: #17253d; font-size: 24px; }.metrics-grid span { display: block; color: #8791a1; font-size: 12px; margin-top: 5px; }
.feature-section { padding: 88px 0; background: #fff; }.section-heading { text-align: center; max-width: 620px; margin: 0 auto 42px; }.section-heading > span { color: var(--brand-primary); font-size: 12px; font-weight: 700; letter-spacing: 1px; }
.section-heading h2 { color: #17253d; font-size: 32px; margin: 10px 0 12px; }.section-heading p { color: #7b8595; font-size: 14px; }.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.feature-grid article { position: relative; border: 1px solid #e3e8f0; border-radius: 12px; padding: 30px; min-height: 220px; transition: .18s ease; }.feature-grid article:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(31,53,82,.08); }
.step { position: absolute; right: 24px; top: 22px; color: #d8e0eb; font-size: 24px; font-weight: 700; }.feature-icon { width: 45px; height: 45px; display: grid; place-items: center; color: var(--brand-primary); background: #edf5ff; border-radius: 10px; font-size: 20px; }
.feature-grid h3 { font-size: 18px; color: #18263d; margin: 22px 0 10px; }.feature-grid p { color: #788396; font-size: 13px; line-height: 1.8; }
.demo-note { background: #f6f8fb; padding: 44px 0; }.note-card { display: flex; align-items: center; gap: 18px; }.note-icon { flex: 0 0 36px; width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid #9ebce0; color: var(--brand-primary); border-radius: 50%; font-weight: 700; }
.note-card > div:nth-child(2) { flex: 1; }.note-card strong { color: #24334b; font-size: 14px; }.note-card p { margin: 5px 0 0; color: #7b8595; line-height: 1.6; }.note-card a { color: var(--brand-primary); font-weight: 600; white-space: nowrap; text-decoration: none; }
@media (max-width: 991px) {
  .hero-section { padding: 120px 0 70px; }.hero-grid { grid-template-columns: 1fr; gap: 50px; }.hero-copy { text-align: center; }.hero-lead { margin-left: auto; margin-right: auto; }.hero-actions, .hero-trust { justify-content: center; }.portfolio-preview { max-width: 620px; margin: auto; width: 100%; }
}
@media (max-width: 767px) {
  .hero-section { padding: 98px 0 54px; }.hero-grid { gap: 38px; }.hero-copy h1 { font-size: 34px; letter-spacing: -1px; }.hero-lead { font-size: 15px; line-height: 1.75; }.hero-actions { flex-direction: column; }.hero-actions a { width: 100%; }.hero-trust { gap: 8px 16px; }
  .portfolio-preview { padding: 18px; border-radius: 13px; }.preview-list { grid-template-columns: 1fr; }.metrics-grid { grid-template-columns: 1fr 1fr; row-gap: 24px; }.metrics-grid div:nth-child(2) { border: 0; }
  .feature-section { padding: 60px 0; }.section-heading h2 { font-size: 26px; }.feature-grid { grid-template-columns: 1fr; }.feature-grid article { min-height: 0; }
  .note-card { align-items: flex-start; flex-wrap: wrap; }.note-card > div:nth-child(2) { flex-basis: calc(100% - 58px); }.note-card a { margin-left: 54px; }
}
</style>
