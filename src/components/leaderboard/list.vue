<template>
  <div class="lb-page">
    <div class="container">
      <div class="lb-header">
        <div>
          <p class="lb-title">{{ $t('leaderboard.menu') }}</p>
          <p class="lb-subtitle">{{ $t('leaderboard.subtitle') }}</p>
        </div>
        <el-select v-model="sortKey" class="lb-sort">
          <el-option :label="$t('leaderboard.sort_return')" value="monthReturnRatePct" />
          <el-option :label="$t('leaderboard.sort_followers')" value="followerCount" />
          <el-option :label="$t('leaderboard.sort_win_rate')" value="winRatePct" />
          <el-option :label="$t('leaderboard.sort_balance')" value="accountBalanceUsd" />
        </el-select>
      </div>

      <div class="lb-filters">
        <el-input
          v-model="searchQuery"
          class="lb-search"
          :placeholder="$t('leaderboard.search_placeholder')"
          clearable
        />
        <el-radio-group v-model="riskFilter" class="lb-risk-filter">
          <el-radio-button label="all">{{ $t('leaderboard.risk_all') }}</el-radio-button>
          <el-radio-button label="low">{{ $t('leaderboard.risk_low') }}</el-radio-button>
          <el-radio-button label="medium">{{ $t('leaderboard.risk_medium') }}</el-radio-button>
          <el-radio-button label="high">{{ $t('leaderboard.risk_high') }}</el-radio-button>
        </el-radio-group>
      </div>

      <div class="lb-grid" v-if="sortedTraders.length">
        <trader-card v-for="trader in sortedTraders" :trader="trader" :key="trader.id" />
      </div>
      <div class="lb-empty" v-else>{{ $t('leaderboard.no_results') }}</div>
    </div>
  </div>
</template>

<script>
import traders from '@/data/mockTraders'
import TraderCard from './card.vue'

export default {
  components: { TraderCard },
  data() {
    return {
      traders,
      sortKey: 'monthReturnRatePct',
      searchQuery: '',
      riskFilter: 'all'
    }
  },
  computed: {
    filteredTraders() {
      const query = this.searchQuery.trim().toLowerCase()
      return this.traders
        .filter((t) => t.name.toLowerCase().includes(query))
        .filter((t) => this.riskFilter === 'all' || t.riskLevel === this.riskFilter)
    },
    sortedTraders() {
      return [...this.filteredTraders].sort((a, b) => b[this.sortKey] - a[this.sortKey])
    }
  }
}
</script>

<style scoped>
.lb-page {
  min-height: 100vh;
  background: var(--surface-page);
  padding: 110px 0 60px;
}
.lb-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.lb-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink-primary);
  margin: 0 0 6px;
}
.lb-subtitle {
  color: var(--ink-secondary);
  font-size: 14px;
  margin: 0;
}
.lb-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}
.lb-search {
  max-width: 280px;
}
.lb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}
.lb-empty {
  text-align: center;
  color: var(--ink-muted);
  padding: 60px 0;
}
</style>
