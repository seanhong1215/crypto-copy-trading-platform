<template>
  <div class="mkd-page">
    <div class="container">
      <p class="mkd-title">{{ displaySymbol }}</p>
      <p class="mkd-subtitle">{{ $t('market_detail.subtitle') }}</p>

      <el-radio-group v-model="days" class="mkd-range">
        <el-radio-button :label="1">{{ $t('market_detail.range_1d') }}</el-radio-button>
        <el-radio-button :label="7">{{ $t('market_detail.range_7d') }}</el-radio-button>
        <el-radio-button :label="30">{{ $t('market_detail.range_30d') }}</el-radio-button>
      </el-radio-group>

      <div class="mkd-chart-wrap">
        <div class="mkd-loading" v-if="loading">{{ $t('market.loading') }}</div>
        <div class="mkd-error" v-else-if="error">
          <p>{{ $t('market_detail.load_error') }}</p>
          <button class="mk-refresh-btn" @click="fetchAndRender">{{ $t('market.retry') }}</button>
        </div>
        <div ref="klineChart" class="mkd-chart" v-show="!loading && !error"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOhlc, MARKET_SYMBOLS } from '@/utils/marketApi'
import * as echarts from '@/utils/echarts'
import { cssVar } from '@/utils/chartTheme'

export default {
  data() {
    return {
      days: 7,
      ohlcRaw: [],
      loading: true,
      error: false,
      chart: null
    }
  },
  computed: {
    coinId() {
      return this.$route.params.id
    },
    displaySymbol() {
      const match = MARKET_SYMBOLS.find((m) => m.id === this.coinId)
      return match ? match.symbol : this.coinId
    }
  },
  watch: {
    days() {
      this.fetchAndRender()
    }
  },
  mounted() {
    this.$nextTick(this.fetchAndRender)
  },
  methods: {
    async fetchAndRender() {
      this.loading = true
      this.error = false
      try {
        this.ohlcRaw = await fetchOhlc(this.coinId, this.days)
        this.loading = false
        this.$nextTick(this.renderChart)
      } catch (e) {
        this.loading = false
        this.error = true
      }
    },
    renderChart() {
      if (!this.$refs.klineChart || !this.ohlcRaw.length) return
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.klineChart)
      }
      const good = cssVar(this.$el, '--color-good')
      const critical = cssVar(this.$el, '--color-critical')
      const border = cssVar(this.$el, '--border-hairline')
      const muted = cssVar(this.$el, '--ink-muted')

      const labels = this.ohlcRaw.map(([ts]) => {
        const d = new Date(ts)
        return this.days === 1
          ? d.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' })
          : d.toISOString().slice(0, 10)
      })
      const candles = this.ohlcRaw.map(([, open, high, low, close]) => [open, close, low, high])

      this.chart.setOption({
        grid: { left: 60, right: 20, top: 20, bottom: 30 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: labels,
          axisLine: { lineStyle: { color: border } },
          axisLabel: { color: muted, interval: 'auto', hideOverlap: true }
        },
        yAxis: {
          type: 'value',
          scale: true,
          splitLine: { lineStyle: { color: border } },
          axisLabel: { color: muted }
        },
        series: [
          {
            type: 'candlestick',
            data: candles,
            itemStyle: {
              color: good,
              color0: critical,
              borderColor: good,
              borderColor0: critical
            }
          }
        ]
      })
      this.chart.resize()
    }
  }
}
</script>

<style scoped>
.mkd-page {
  min-height: 100vh;
  background: var(--surface-page);
  padding: 110px 0 60px;
}
.mkd-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink-primary);
  margin: 0 0 6px;
}
.mkd-subtitle {
  color: var(--ink-muted);
  font-size: 12px;
  margin: 0 0 20px;
}
.mkd-range {
  margin-bottom: 20px;
}
.mkd-chart-wrap {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 20px;
}
.mkd-chart {
  width: 100%;
  height: 420px;
}
.mkd-loading,
.mkd-error {
  text-align: center;
  color: var(--ink-secondary);
  padding: 80px 20px;
}
.mk-refresh-btn {
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
  background: transparent;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  margin-top: 12px;
}
</style>
