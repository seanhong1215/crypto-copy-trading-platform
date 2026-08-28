<template>
  <el-popover trigger="click" placement="bottom-end" width="320" popper-class="notif-popover">
    <div class="notif-header">
      <span>{{ $t('notifications.bell_title') }}</span>
      <span class="notif-mark-read" v-if="notifications.length" @click="markAllRead">{{ $t('notifications.mark_all_read') }}</span>
    </div>
    <div class="notif-empty" v-if="!notifications.length">{{ $t('notifications.empty') }}</div>
    <div class="notif-list" v-else>
      <div
        class="notif-item"
        :class="{ unread: !isRead(n.id) }"
        v-for="n in notifications"
        :key="n.id"
      >
        <div class="notif-text">
          {{ $t('notifications.item_text', { name: n.traderName }) }}
          ({{ n.symbol }} {{ n.side === 'buy' ? $t('notifications.side_buy') : $t('notifications.side_sell') }})
        </div>
        <div class="notif-time">{{ n.time }}</div>
      </div>
    </div>
    <template #reference>
      <span class="notif-trigger" aria-label="通知">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0">🔔</el-badge>
      </span>
    </template>
  </el-popover>
</template>

<script>
import { deriveNotifications } from '@/utils/notifications'

export default {
  name: 'NotificationBell',
  computed: {
    notifications() {
      return deriveNotifications(this.$store.state.followedTraders)
    },
    unreadCount() {
      return this.notifications.filter((n) => !this.isRead(n.id)).length
    }
  },
  methods: {
    isRead(id) {
      return this.$store.state.readNotificationIds.includes(id)
    },
    markAllRead() {
      this.$store.commit('MARK_NOTIFICATIONS_READ', this.notifications.map((n) => n.id))
    }
  }
}
</script>

<style scoped>
.notif-trigger {
  cursor: pointer;
  font-size: 18px;
  vertical-align: middle;
  margin-right: 4px;
  display: inline-block;
}
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--ink-primary);
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border-hairline);
}
.notif-mark-read {
  font-size: 12px;
  font-weight: normal;
  color: var(--brand-primary);
  cursor: pointer;
}
.notif-empty {
  text-align: center;
  color: var(--ink-muted);
  font-size: 13px;
  padding: 16px 0;
}
.notif-list {
  max-height: 320px;
  overflow-y: auto;
}
.notif-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--border-hairline);
}
.notif-item:last-child {
  border-bottom: none;
}
.notif-item.unread .notif-text {
  font-weight: 600;
  color: var(--ink-primary);
}
.notif-text {
  font-size: 13px;
  color: var(--ink-secondary);
}
.notif-time {
  font-size: 11px;
  color: var(--ink-muted);
  margin-top: 2px;
}
</style>
