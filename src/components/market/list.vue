<template>
  <div class="mk-page">
    <div class="container">
      <div class="mk-header">
        <p class="mk-title">{{ $t('market.menu') }}</p>
        <p class="mk-subtitle">{{ $t('market.subtitle') }}</p>
        <p class="mk-disclaimer">{{ $t('market.live_disclaimer') }}</p>
      </div>

      <div class="mk-toolbar">
        <span class="mk-updated" v-if="lastUpdated">{{ $t('market.last_updated') }}: {{ formatTime(lastUpdated) }}</span>
        <button class="mk-refresh-btn" :disabled="status === 'refreshing'" @click="refresh">
          {{ $t('market.refresh') }}
        </button>
      </div>

      <div class="mk-loading" v-if="status === 'loading'">{{ $t('market.loading') }}</div>

      <div class="mk-error" v-else-if="status === 'error' && !rows.length">
        <p>{{ $t('market.error_title') }}</p>
        <button class="mk-refresh-btn" @click="refresh">{{ $t('market.retry') }}</button>
      </div>

      <div v-else>
        <p class="mk-stale-notice" v-if="status === 'error' && rows.length">{{ $t('market.stale_notice') }}</p>
        <div class="mk-grid">
          <div class="mk-card" v-for="row in rows" :key="row.symbol" @click="goDetail(row.symbol)">
            <div class="mk-symbol">{{ row.symbol }}</div>
            <div class="mk-price">${{ formatPrice(row.price) }}</div>
            <div class="mk-change" :class="row.change24hPct >= 0 ? 'good' : 'critical'">
              {{ row.change24hPct >= 0 ? '+' : '' }}{{ row.change24hPct.toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchMarketPrices, SYMBOL_TO_COINGECKO_ID } from '@/utils/marketApi'

const POLL_INTERVAL_MS = 45000

export default {
  data() {
    return {
      rows: [],
      status: 'loading', // loading | refreshing | success | error
      lastUpdated: null,
      pollTimer: null
    }
  },
  created() {
    this.load()
    this.pollTimer = setInterval(this.load, POLL_INTERVAL_MS)
  },
  beforeDestroy() {
    clearInterval(this.pollTimer)
  },
  methods: {
    async load() {
      if (this.status !== 'loading') this.status = 'refreshing'
      try {
        this.rows = await fetchMarketPrices()
        this.status = 'success'
        this.lastUpdated = new Date()
      } catch (e) {
        this.status = 'error'
      }
    },
    refresh() {
      this.status = this.rows.length ? 'refreshing' : 'loading'
      this.load()
    },
    goDetail(symbol) {
      const id = SYMBOL_TO_COINGECKO_ID[symbol]
      if (id) this.$router.push('/market/' + id)
    },
    formatPrice(price) {
      return price >= 1 ? price.toFixed(2) : price.toFixed(4)
    },
    formatTime(date) {
      return date.toLocaleTimeString('zh-CN', { hour12: false })
    }
  }
}
</script>

<style scoped>
.mk-page {
  min-height: 100vh;
  background: var(--surface-page);
  padding: 110px 0 60px;
}
.mk-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink-primary);
  margin: 0 0 6px;
}
.mk-subtitle {
  color: var(--ink-secondary);
  font-size: 14px;
  margin: 0 0 6px;
}
.mk-disclaimer {
  color: var(--ink-muted);
  font-size: 12px;
  margin: 0 0 20px;
}
.mk-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.mk-updated {
  font-size: 12px;
  color: var(--ink-muted);
}
.mk-refresh-btn {
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
  background: transparent;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
}
.mk-refresh-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.mk-loading,
.mk-error {
  text-align: center;
  color: var(--ink-secondary);
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 60px 20px;
}
.mk-stale-notice {
  font-size: 12px;
  color: var(--color-warning);
  margin-bottom: 12px;
}
.mk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}
.mk-card {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 18px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.mk-card:hover {
  box-shadow: 0 4px 16px rgba(11, 11, 11, 0.08);
  transform: translateY(-2px);
}
.mk-symbol {
  font-size: 13px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}
.mk-price {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink-primary);
  margin-bottom: 6px;
}
.mk-change {
  font-size: 14px;
  font-weight: 600;
}
.mk-change.good {
  color: var(--color-good);
}
.mk-change.critical {
  color: var(--color-critical);
}
</style>
