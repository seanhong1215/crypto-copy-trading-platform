<template>
  <el-dialog
    v-model="innerVisible"
    :append-to-body="true"
    width="420px"
    :title="$t('copy_settings.title')"
  >
    <div class="cs-field">
      <div class="cs-label">{{ $t('copy_settings.copy_mode') }}</div>
      <el-radio-group v-model="form.copyMode">
        <el-radio-button label="ratio">{{ $t('copy_settings.mode_ratio') }}</el-radio-button>
        <el-radio-button label="fixed">{{ $t('copy_settings.mode_fixed') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="cs-field">
      <div class="cs-label">{{ $t('copy_settings.allocation_amount') }}</div>
      <el-input-number v-model="form.allocationUsd" :min="10" :step="50" />
    </div>
    <div class="cs-field">
      <div class="cs-label">{{ $t('copy_settings.stop_loss') }}</div>
      <el-radio-group v-model="form.stopLossPct">
        <el-radio-button :label="-10">-10%</el-radio-button>
        <el-radio-button :label="-20">-20%</el-radio-button>
        <el-radio-button :label="-30">-30%</el-radio-button>
      </el-radio-group>
      <div class="cs-hint">{{ $t('copy_settings.stop_loss_hint') }}</div>
    </div>
    <template #footer>
      <el-button @click="innerVisible = false">{{ $t('copy_settings.cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('copy_settings.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'CopySettingsModal',
  props: {
    trader: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.defaultForm()
    }
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = this.defaultForm()
      }
    }
  },
  methods: {
    defaultForm() {
      return { copyMode: 'ratio', allocationUsd: 500, stopLossPct: -20 }
    },
    async confirm() {
      if (!this.form.allocationUsd || this.form.allocationUsd <= 0) {
        this.$message.warning(this.$t('copy_settings.allocation_required'))
        return
      }
      try {
        await this.$store.dispatch('followTrader', {
          traderId: this.trader.id,
          copyMode: this.form.copyMode,
          allocationUsd: this.form.allocationUsd,
          stopLossPct: this.form.stopLossPct
        })
        this.$message.success(this.$t('copy_settings.follow_success', { name: this.trader.name }))
        this.innerVisible = false
      } catch (e) {
        this.$message.error(this.$t('message.error'))
      }
    }
  }
}
</script>

<style scoped>
.cs-field {
  margin-bottom: 20px;
}
.cs-label {
  font-size: 13px;
  color: var(--ink-secondary);
  margin-bottom: 8px;
}
.cs-hint {
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: 8px;
}
</style>
