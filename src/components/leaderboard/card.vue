<template>
  <div class="lb-card" @click="goDetail">
    <div class="lb-card-top">
      <div class="lb-avatar" :style="{ background: trader.avatarColor }">{{ trader.initial }}</div>
      <div class="lb-name-wrap">
        <div class="lb-name">{{ trader.name }}</div>
        <div class="lb-followers">{{ trader.followerCount }} {{ $t('leaderboard.follow_num') }}</div>
      </div>
      <button
        class="lb-follow-btn"
        :class="{ following: isFollowing }"
        @click.stop="toggleFollow"
      >{{ isFollowing ? $t('leaderboard.following') : $t('leaderboard.follow') }}</button>
    </div>
    <div class="lb-risk-tag" :class="'risk-' + trader.riskLevel">{{ $t('leaderboard.risk_' + trader.riskLevel) }}</div>
    <div class="lb-copy-settings" v-if="isFollowing && followSettings">
      {{ $t('following.settings_summary', { amount: followSettings.allocationUsd, pct: followSettings.stopLossPct }) }}
    </div>
    <div class="lb-stats">
      <div class="lb-stat">
        <div class="lb-stat-label">{{ $t('leaderboard.month_profit_percent') }}</div>
        <div class="lb-stat-value" :class="trader.monthReturnRatePct >= 0 ? 'good' : 'critical'">
          {{ trader.monthReturnRatePct >= 0 ? '+' : '' }}{{ trader.monthReturnRatePct }}%
        </div>
      </div>
      <div class="lb-stat">
        <div class="lb-stat-label">{{ $t('leaderboard.month_win') }}</div>
        <div class="lb-stat-value">{{ trader.monthWinRatePct }}%</div>
      </div>
      <div class="lb-stat">
        <div class="lb-stat-label">{{ $t('leaderboard.account_balance') }}</div>
        <div class="lb-stat-value">${{ formatNumber(trader.accountBalanceUsd) }}</div>
      </div>
    </div>
    <copy-settings-modal :trader="trader" :visible.sync="showCopyModal" />
  </div>
</template>

<script>
import requireLogin from '@/utils/requireLogin'
import CopySettingsModal from './copySettingsModal.vue'

export default {
  name: 'TraderCard',
  components: { CopySettingsModal },
  props: {
    trader: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showCopyModal: false
    }
  },
  computed: {
    followSettings() {
      return this.$store.state.followedTraders[this.trader.id]
    },
    isFollowing() {
      return !!this.followSettings
    }
  },
  methods: {
    toggleFollow() {
      requireLogin(() => {
        if (this.isFollowing) {
          this.$store.dispatch('unfollowTrader', this.trader.id).catch(() => {
            this.$message.error(this.$t('message.error'))
          })
        } else {
          this.showCopyModal = true
        }
      })
    },
    goDetail() {
      this.$router.push('/trader/' + this.trader.id)
    },
    formatNumber(n) {
      return n.toLocaleString('en-US')
    }
  }
}
</script>

<style scoped>
.lb-card {
  background: var(--surface-card);
  border: 1px solid var(--border-hairline);
  border-radius: 10px;
  padding: 18px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.lb-card:hover {
  box-shadow: 0 4px 16px rgba(11, 11, 11, 0.08);
  transform: translateY(-2px);
}
.lb-card-top {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.lb-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lb-name-wrap {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}
.lb-name {
  font-weight: 600;
  color: var(--ink-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lb-followers {
  font-size: 12px;
  color: var(--ink-muted);
}
.lb-follow-btn {
  border: 1px solid var(--brand-primary);
  color: var(--brand-primary);
  background: transparent;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
}
.lb-follow-btn.following {
  background: var(--brand-primary);
  color: #fff;
}
.lb-risk-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.lb-risk-tag.risk-low {
  color: var(--color-good);
  background: rgba(12, 163, 12, 0.1);
}
.lb-risk-tag.risk-medium {
  color: var(--color-warning);
  background: rgba(250, 178, 25, 0.12);
}
.lb-risk-tag.risk-high {
  color: var(--color-critical);
  background: rgba(208, 59, 59, 0.1);
}
.lb-copy-settings {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 14px;
  margin-top: -6px;
}
.lb-stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border-hairline);
  padding-top: 14px;
}
.lb-stat-label {
  font-size: 12px;
  color: var(--ink-muted);
  margin-bottom: 4px;
}
.lb-stat-value {
  font-weight: 600;
  color: var(--ink-primary);
}
.lb-stat-value.good {
  color: var(--color-good);
}
.lb-stat-value.critical {
  color: var(--color-critical);
}
</style>
