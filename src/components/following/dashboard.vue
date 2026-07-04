<template>
  <div class="fw-page">
    <div class="container">
      <p class="fw-title">{{ $t('following.menu') }}</p>
      <p class="fw-subtitle">{{ $t('following.subtitle') }}</p>

      <div class="fw-empty" v-if="!isLoggedIn">
        <p class="fw-empty-title">{{ $t('following.login_title') }}</p>
        <p class="fw-empty-desc">{{ $t('following.login_desc') }}</p>
        <button class="fw-cta" @click="goLogin">{{ $t('following.login_cta') }}</button>
      </div>

      <div class="fw-empty" v-else-if="!followedTraders.length">
        <p class="fw-empty-title">{{ $t('following.empty_title') }}</p>
        <p class="fw-empty-desc">{{ $t('following.empty_desc') }}</p>
        <router-link to="/leaderboard" tag="button" class="fw-cta">{{ $t('following.browse_cta') }}</router-link>
      </div>

      <div v-else>
        <div class="fw-stats">
          <div class="fw-stat-card">
            <div class="fw-stat-label">{{ $t('following.total_followed') }}</div>
            <div class="fw-stat-value">{{ followedTraders.length }}</div>
          </div>
          <div class="fw-stat-card">
            <div class="fw-stat-label">{{ $t('following.aggregate_pnl') }}</div>
            <div class="fw-stat-value" :class="aggregatePnlUsd >= 0 ? 'good' : 'critical'">
              {{ signedAmount(aggregatePnlUsd) }}
            </div>
          </div>
          <div class="fw-stat-card">
            <div class="fw-stat-label">{{ $t('following.avg_return') }}</div>
            <div class="fw-stat-value" :class="avgReturnRatePct >= 0 ? 'good' : 'critical'">
              {{ avgReturnRatePct >= 0 ? '+' : '' }}{{ avgReturnRatePct.toFixed(1) }}%
            </div>
          </div>
        </div>

        <div class="fw-chart-wrap">
          <div class="fw-section-title">{{ $t('following.portfolio_curve') }}</div>
          <div ref="portfolioChart" class="fw-chart"></div>
        </div>

        <div class="lb-grid">
          <trader-card v-for="trader in followedTraders" :trader="trader" :key="trader.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import traders from '@/data/mockTraders'
import requireLogin from '@/utils/requireLogin'
import { cssVar, resolveAvatarColor } from '@/utils/chartTheme'
import TraderCard from '@/components/leaderboard/card.vue'

export default {
  components: { TraderCard },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.$store.state.TOKEN
    },
    followedTraders() {
      return traders.filter((t) => !!this.$store.state.followedTraders[t.id])
    },
    aggregatePnlUsd() {
      return this.followedTraders.reduce((sum, t) => sum + t.monthProfitUsd, 0)
    },
    avgReturnRatePct() {
      if (!this.followedTraders.length) return 0
      const total = this.followedTraders.reduce((sum, t) => sum + t.monthReturnRatePct, 0)
      return total / this.followedTraders.length
    }
  },
  watch: {
    followedTraders() {
      this.$nextTick(this.renderChart)
    }
  },
  mounted() {
    if (this.followedTraders.length) {
      this.$nextTick(this.renderChart)
    }
  },
  methods: {
    goLogin() {
      requireLogin(() => {})
    },
    formatNumber(n) {
      return Math.abs(n).toLocaleString('en-US')
    },
    signedAmount(n) {
      return (n >= 0 ? '+' : '-') + '$' + this.formatNumber(n)
    },
    renderChart() {
      if (!this.$refs.portfolioChart) return
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.portfolioChart)
      }
      const border = cssVar(this.$el, '--border-hairline')
      const muted = cssVar(this.$el, '--ink-muted')
      const dates = this.followedTraders[0].equityCurve.map((p) => p.date)
      this.chart.setOption({
        grid: { left: 60, right: 20, top: 40, bottom: 30 },
        tooltip: { trigger: 'axis' },
        legend: {
          top: 0,
          textStyle: { color: muted },
          data: this.followedTraders.map((t) => t.name)
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: border } },
          axisLabel: { color: muted }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: border } },
          axisLabel: { color: muted, formatter: (v) => '$' + v.toLocaleString('en-US') }
        },
        series: this.followedTraders.map((t) => ({
          name: t.name,
          type: 'line',
          data: t.equityCurve.map((p) => p.value),
          symbol: 'none',
          lineStyle: { color: resolveAvatarColor(this.$el, t.avatarColor), width: 2 }
        }))
      }, true)
      this.chart.resize()
    }
  }
}
</script>

<style scoped>
.fw-page {
  min-height: 100vh;
  background: var(--surface-page);
  padding: 110px 0 60px;
}
.fw-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink-primary);
  margin: 0 0 6px;
}
.fw-subtitle {
  color: var(--ink-secondary);
  font-size: 14px;
  margin: 0 0 28px;
}
.fw-empty {
  text-align: center;
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 60px 20px;
}
.fw-empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink-primary);
  margin: 0 0 8px;
}
.fw-empty-desc {
  color: var(--ink-secondary);
  font-size: 14px;
  margin: 0 0 20px;
}
.fw-cta {
  border: none;
  background: var(--brand-primary);
  color: #fff;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 14px;
  cursor: pointer;
}
.fw-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.fw-stat-card {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 16px;
}
.fw-stat-label {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}
.fw-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink-primary);
}
.fw-stat-value.good {
  color: var(--color-good);
}
.fw-stat-value.critical {
  color: var(--color-critical);
}
.fw-chart-wrap {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}
.fw-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink-primary);
  margin-bottom: 12px;
}
.fw-chart {
  width: 100%;
  height: 320px;
}
.lb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}
</style>
