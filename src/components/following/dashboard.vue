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
              {{ aggregatePnlDisplay }}
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
import { api } from '@/utils/api'
import { cssVar, resolveAvatarColor } from '@/utils/chartTheme'
import TraderCard from '@/components/leaderboard/card.vue'

export default {
  components: { TraderCard },
  data() {
    return {
      chart: null,
      // 聚合损益由后端以 Decimal 计算（依使用者每笔跟单的 allocationUsd）
      pnlData: null
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.$store.state.TOKEN
    },
    followedTraders() {
      return traders.filter((t) => !!this.$store.state.followedTraders[t.id])
    },
    // 从后端结果取值（字串金额 → Number 供样式判断正负）
    aggregatePnlUsd() {
      return this.pnlData ? Number(this.pnlData.aggregatePnlUsd) : 0
    },
    // 显示时保留后端 Decimal 的两位精度字串
    aggregatePnlDisplay() {
      const raw = this.pnlData ? this.pnlData.aggregatePnlUsd : '0.00'
      const n = Number(raw)
      return (n >= 0 ? '+$' : '-$') + Math.abs(n).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    avgReturnRatePct() {
      return this.pnlData ? this.pnlData.avgReturnPct : 0
    }
  },
  watch: {
    followedTraders() {
      this.loadPnl()
      this.$nextTick(this.renderChart)
    }
  },
  mounted() {
    if (this.followedTraders.length) {
      this.loadPnl()
      this.$nextTick(this.renderChart)
    }
  },
  methods: {
    goLogin() {
      requireLogin(() => {})
    },
    // 向后端取 Decimal 聚合损益（失败静默保留旧值）
    loadPnl() {
      if (!this.isLoggedIn) return
      api.getPnl().then((d) => { this.pnlData = d }).catch(() => {})
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
      const inkPrimary = cssVar(this.$el, '--ink-primary')
      const dates = this.followedTraders[0].equityCurve.map((p) => p.date)
      this.chart.setOption({
        // 右側留白給端點直接標註(直接標註 = 不 hover 也讀得到最新值)
        grid: { left: 60, right: 96, top: 40, bottom: 30 },
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
        series: this.followedTraders.map((t) => {
          const lineColor = resolveAvatarColor(this.$el, t.avatarColor)
          const surface = cssVar(this.$el, '--surface-card')
          const last = t.equityCurve.length - 1
          return {
            name: t.name,
            type: 'line',
            // 端點直接標註最新值(ECharts 4 沒有 v5 的 endLabel,改用
            // 「最後一個資料點單獨給 symbol + label」的 v4 相容做法)。
            // 文字用墨色 token(文字不穿系列色);端點圓點帶表面色圓環。
            // 這也是淺色系列的可讀性緩解——值不靠 hover 就可見。
            data: t.equityCurve.map((p, i) =>
              i === last
                ? {
                    value: p.value,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                      color: lineColor,
                      borderColor: surface,
                      borderWidth: 2
                    },
                    label: {
                      show: true,
                      position: 'right',
                      formatter: (params) =>
                        '$' + Number(params.value).toLocaleString('en-US'),
                      color: inkPrimary,
                      fontSize: 11,
                      fontWeight: 600
                    }
                  }
                : p.value
            ),
            symbol: 'none',
            lineStyle: { color: lineColor, width: 2 },
            itemStyle: { color: lineColor }
          }
        })
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
