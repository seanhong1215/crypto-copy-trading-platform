<template>
  <div class="td-page" v-if="trader">
    <div class="container">
      <div class="td-header">
        <div class="lb-avatar" :style="{ background: trader.avatarColor }">{{ trader.initial }}</div>
        <div class="td-name-wrap">
          <div class="td-name">{{ trader.name }}</div>
          <div class="td-followers">{{ trader.followerCount }} {{ $t('leaderboard.follow_num') }}</div>
          <div class="lb-copy-settings" v-if="isFollowing && followSettings">
            {{ $t('following.settings_summary', { amount: followSettings.allocationUsd, pct: followSettings.stopLossPct }) }}
          </div>
        </div>
        <button
          class="lb-follow-btn"
          :class="{ following: isFollowing }"
          @click="toggleFollow"
        >{{ isFollowing ? $t('leaderboard.following') : $t('leaderboard.follow') }}</button>
      </div>

      <div class="td-stats">
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('trader_detail.total_profit') }}</div>
          <div class="td-stat-value" :class="trader.totalProfitUsd >= 0 ? 'good' : 'critical'">
            {{ signedAmount(trader.totalProfitUsd) }}
          </div>
        </div>
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('trader_detail.balance') }}</div>
          <div class="td-stat-value">${{ formatNumber(trader.accountBalanceUsd) }}</div>
        </div>
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('trader_detail.win_percent') }}</div>
          <div class="td-stat-value">{{ trader.winRatePct }}%</div>
        </div>
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('leaderboard.month_profit_percent') }}</div>
          <div class="td-stat-value" :class="trader.monthReturnRatePct >= 0 ? 'good' : 'critical'">
            {{ trader.monthReturnRatePct >= 0 ? '+' : '' }}{{ trader.monthReturnRatePct }}%
          </div>
        </div>
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('trader_detail.total_trade_count') }}</div>
          <div class="td-stat-value">{{ trader.totalTrades }}</div>
        </div>
        <div class="td-stat-card">
          <div class="td-stat-label">{{ $t('leaderboard.month_win') }}</div>
          <div class="td-stat-value">{{ trader.monthWinRatePct }}%</div>
        </div>
      </div>

      <div class="td-chart-wrap">
        <div class="td-section-title">{{ $t('trader_detail.equity_curve') }}</div>
        <div ref="equityChart" class="td-chart"></div>
      </div>

      <div class="td-table-wrap">
        <div class="td-section-title">{{ $t('trader_detail.recent_trades') }}</div>
        <el-table :data="trader.recentTrades" style="width:100%">
          <el-table-column prop="time" :label="$t('trader_detail.time')" />
          <el-table-column prop="symbol" :label="$t('trader_detail.symbol')" />
          <el-table-column :label="$t('trader_detail.side')">
            <template slot-scope="scope">
              <span :class="scope.row.side === 'buy' ? 'good' : 'critical'">
                {{ scope.row.side === 'buy' ? $t('trader_detail.buy') : $t('trader_detail.sell') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="volume" :label="$t('trader_detail.volume')" />
          <el-table-column :label="$t('trader_detail.pnl')">
            <template slot-scope="scope">
              <span :class="scope.row.pnlUsd >= 0 ? 'good' : 'critical'">
                {{ signedAmount(scope.row.pnlUsd) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <copy-settings-modal v-if="trader" :trader="trader" :visible.sync="showCopyModal" />
  </div>
</template>

<script>
import traders from '@/data/mockTraders'
import requireLogin from '@/utils/requireLogin'
import { cssVar } from '@/utils/chartTheme'
import CopySettingsModal from './copySettingsModal.vue'

export default {
  components: { CopySettingsModal },
  data() {
    return {
      trader: null,
      chart: null,
      showCopyModal: false
    }
  },
  created() {
    const id = Number(this.$route.params.id)
    const found = traders.find((t) => t.id === id)
    if (!found) {
      this.$router.replace('/leaderboard')
      return
    }
    this.trader = found
  },
  mounted() {
    if (this.trader) {
      this.$nextTick(this.renderChart)
    }
  },
  computed: {
    followSettings() {
      return this.trader && this.$store.state.followedTraders[this.trader.id]
    },
    isFollowing() {
      return !!this.followSettings
    }
  },
  methods: {
    toggleFollow() {
      requireLogin(() => {
        if (this.isFollowing) {
          this.$store.commit('UNFOLLOW_TRADER', this.trader.id)
        } else {
          this.showCopyModal = true
        }
      })
    },
    formatNumber(n) {
      return Math.abs(n).toLocaleString('en-US')
    },
    signedAmount(n) {
      return (n >= 0 ? '+' : '-') + '$' + this.formatNumber(n)
    },
    renderChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.equityChart)
      }
      const border = cssVar(this.$el, '--border-hairline')
      const muted = cssVar(this.$el, '--ink-muted')
      const brand = cssVar(this.$el, '--brand-primary')
      const dates = this.trader.equityCurve.map((p) => p.date)
      const values = this.trader.equityCurve.map((p) => p.value)
      this.chart.setOption({
        grid: { left: 50, right: 20, top: 20, bottom: 30 },
        tooltip: { trigger: 'axis' },
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
        series: [
          {
            type: 'line',
            data: values,
            symbol: 'none',
            lineStyle: { color: brand, width: 2 },
            areaStyle: { color: brand + '1a' }
          }
        ]
      })
      this.chart.resize()
    }
  }
}
</script>

<style scoped>
.td-page {
  min-height: 100vh;
  background: var(--surface-page);
  padding: 110px 0 60px;
}
.lb-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.td-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.td-name-wrap {
  flex: 1;
  margin-left: 14px;
}
.td-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink-primary);
}
.td-followers {
  font-size: 13px;
  color: var(--ink-muted);
}
.lb-copy-settings {
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: 4px;
}
.lb-follow-btn {
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
  background: transparent;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}
.lb-follow-btn.following {
  background: var(--brand-primary);
  color: #fff;
}
.td-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 30px;
}
.td-stat-card {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 16px;
}
.td-stat-label {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 6px;
}
.td-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-primary);
}
.td-stat-value.good,
.good {
  color: var(--color-good);
}
.td-stat-value.critical,
.critical {
  color: var(--color-critical);
}
.td-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink-primary);
  margin-bottom: 12px;
}
.td-chart-wrap {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}
.td-chart {
  width: 100%;
  height: 320px;
}
.td-table-wrap {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 20px;
}
</style>
