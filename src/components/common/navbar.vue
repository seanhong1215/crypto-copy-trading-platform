<template>
  <header class="site-nav">
    <div class="container nav-inner">
      <router-link class="brand" to="/" aria-label="FinFolio 首頁">
        <img src="@/assets/c_images/brand-lockup.svg" alt="FinFolio" />
      </router-link>

      <nav class="desktop-links" aria-label="主要導覽">
        <router-link to="/leaderboard">{{ $t('leaderboard.menu') }}</router-link>
        <router-link to="/following">{{ $t('following.menu') }}</router-link>
        <router-link to="/market">{{ $t('market.menu') }}</router-link>
      </nav>

      <div class="desktop-actions">
        <template v-if="$store.state.TOKEN">
          <notification-bell />
          <span class="user-name">{{ demoUserName }}</span>
          <button class="text-action" type="button" @click="logout">{{ $t('logout') }}</button>
        </template>
        <template v-else>
          <router-link class="text-action" to="/login">{{ $t('login.menu') }}</router-link>
          <router-link class="primary-action" to="/register">{{ $t('register.menu') }}</router-link>
        </template>
      </div>

      <button class="menu-button" type="button" aria-label="開啟選單" @click="drawer = true">
        <span></span><span></span><span></span>
      </button>
    </div>

    <el-drawer v-model="drawer" direction="rtl" size="min(82vw, 320px)" :with-header="false">
      <div class="mobile-menu">
        <router-link to="/leaderboard" @click="drawer = false">{{ $t('leaderboard.menu') }}</router-link>
        <router-link to="/following" @click="drawer = false">{{ $t('following.menu') }}</router-link>
        <router-link to="/market" @click="drawer = false">{{ $t('market.menu') }}</router-link>
        <button v-if="$store.state.TOKEN" type="button" @click="logout">{{ $t('logout') }}</button>
        <template v-else>
          <router-link to="/login" @click="drawer = false">{{ $t('login.menu') }}</router-link>
          <router-link class="mobile-primary" to="/register" @click="drawer = false">{{ $t('register.menu') }}</router-link>
        </template>
      </div>
    </el-drawer>
  </header>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { ElMessageBox } from 'element-plus'
import 'element-plus/es/components/message-box/style/css'

export default {
  name: 'SiteNavbar',
  components: {
    NotificationBell: defineAsyncComponent(() => import('./notificationBell.vue'))
  },
  data: () => ({ drawer: false }),
  computed: {
    demoUserName() {
      return this.$store.state.USERINFO?.name || this.$t('common.demo_user')
    }
  },
  methods: {
    async logout() {
      try {
        await ElMessageBox.confirm(this.$t('message.sure_logout'), this.$t('common.tip'), {
          confirmButtonText: this.$t('common.ok'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        })
        this.$store.commit('LOGOUT')
        this.drawer = false
        this.$router.push('/')
      } catch (_) {}
    }
  }
}
</script>

<style scoped>
.site-nav { position: sticky; top: 0; z-index: 1000; height: 72px; background: rgba(255,255,255,.94); border-bottom: 1px solid rgba(13,27,42,.08); backdrop-filter: blur(16px); }
.nav-inner { height: 100%; display: flex; align-items: center; gap: 40px; }
.brand { display: inline-flex; width: 145px; flex: 0 0 auto; }
.desktop-links { display: flex; align-items: center; gap: 8px; }
.desktop-links a { padding: 12px 15px; color: #526274; font-weight: 650; border-radius: 10px; transition: .18s ease; }
.desktop-links a:hover, .desktop-links a.router-link-active { color: var(--brand-dark); background: #eaf4f7; }
.desktop-actions { margin-left: auto; display: flex; align-items: center; gap: 18px; }
.user-name { color: #536274; font-size: 14px; }
.text-action { border: 0; background: none; color: var(--brand-dark); cursor: pointer; font-weight: 700; padding: 8px 0; }
.primary-action { color: #fff; background: var(--brand-dark); border-radius: 10px; padding: 11px 18px; font-weight: 700; }
.menu-button { display: none; width: 42px; height: 42px; margin-left: auto; border: 1px solid var(--line); border-radius: 10px; background: #fff; padding: 10px; cursor: pointer; }
.menu-button span { display: block; height: 2px; margin: 4px 0; background: var(--ink); border-radius: 2px; }
.mobile-menu { display: grid; gap: 10px; padding: 28px 8px; }
.mobile-menu a, .mobile-menu button { width: 100%; border: 0; border-radius: 10px; padding: 14px 16px; background: transparent; text-align: left; color: var(--ink); font-weight: 700; cursor: pointer; }
.mobile-menu a.router-link-active { background: #eaf4f7; color: var(--brand-dark); }
.mobile-menu .mobile-primary { background: var(--brand-dark); color: #fff; }
@media (max-width: 800px) { .site-nav { height: 64px; } .desktop-links, .desktop-actions { display: none; } .menu-button { display: block; } .brand { width: 132px; } }
</style>
