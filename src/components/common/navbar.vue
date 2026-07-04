<template>
  <nav
    class="zr-gai-nav navbar navbar-default navbar-fixed-top header"
    ref="nav_header"
    :class="{navbar_white: navbar_white}"
  >
    <div class="container">
      <!-- mobile start -->
      <div class="navbar-header">
        <div class="mobile-menu-root" @click="open_mobile_menus">
          <i class="el-icon-more"></i>
        </div>
        <router-link class="navbar-brand" to="/">
          <img src="@/assets/c_images/brand-lockup.svg" />
        </router-link>
      </div>
      <el-drawer
        :visible.sync="drawer"
        :modal="false"
        direction="rtl"
        :append-to-body="true"
        size="60%"
        :with-header="false"
      >
        <el-menu class="headWrap_menu" active-text-color="#409EFF">
          <el-menu-item @click="drawer=false" index="0">
            <router-link to="/leaderboard" tag="p" exact>
              <span>{{ $t("leaderboard.menu") }}</span>
            </router-link>
          </el-menu-item>
          <el-menu-item @click="drawer=false" index="1">
            <router-link to="/following" tag="p" exact>
              <span>{{ $t("following.menu") }}</span>
            </router-link>
          </el-menu-item>
          <el-menu-item @click="drawer=false" index="2">
            <router-link to="/market" tag="p" exact>
              <span>{{ $t("market.menu") }}</span>
            </router-link>
          </el-menu-item>
          <el-menu-item index="3" @click="logout" v-if="$store.state.TOKEN">
            <p>
              <span type="text">{{ $t("logout") }}</span>
            </p>
          </el-menu-item>
          <el-menu-item @click="login" index="4" v-else>{{ $t("login.menu") }}</el-menu-item>
        </el-menu>
      </el-drawer>
      <!-- mobile end -->

      <!-- PC start -->
      <div ref="menus" class="collapse navbar-collapse" id="header-navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="header-li first">
            <router-link to="/leaderboard" tag="a" exact>
              <span>{{ $t("leaderboard.menu") }}</span>
            </router-link>
          </li>
          <li class="header-li">
            <router-link to="/following" tag="a" exact>
              <span>{{ $t("following.menu") }}</span>
            </router-link>
          </li>
          <li class="header-li">
            <router-link to="/market" tag="a" exact>
              <span>{{ $t("market.menu") }}</span>
            </router-link>
          </li>
        </ul>
        <div class="navbar-right btns" v-if="$store.state.TOKEN">
          <notification-bell />
          <el-link :underline="false" class="language">{{ demoUserName }}</el-link>
          <el-link :underline="false" class="language" @click="logout">{{ $t("logout") }}</el-link>
        </div>
        <div class="navbar-right btns" v-else>
          <el-link :underline="false" class="language" @click="login">{{ $t("login.menu") }}</el-link>
          <el-link :underline="false" class="language" @click="register">{{ $t("register.menu") }}</el-link>
        </div>
      </div>
      <!-- PC end -->
    </div>
  </nav>
</template>

<script>
import store from '@/store'
import NotificationBell from './notificationBell.vue'
export default {
  store,
  components: { NotificationBell },
  data() {
    return {
      drawer: false,
      navbar_white: false
    }
  },
  computed: {
    path() {
      return this.$route.path
    },
    need_change_navbar() {
      return this.path != '/'
    },
    demoUserName() {
      return (this.$store.state.USERINFO && this.$store.state.USERINFO.name) || this.$t('common.demo_user')
    }
  },
  mounted() {
    this.set_header()
  },
  methods: {
    logout() {
      this.$confirm(this.$t('message.sure_logout'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('LOGOUT')
          this.$router.push('/')
        })
        .catch(() => {})
    },
    login() {
      this.$router.push('/login')
    },
    register() {
      this.$router.push('/register')
    },
    set_header() {
      window.addEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      if (!this.need_change_navbar) {
        return
      }
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop > 49) {
        this.navbar_white = true
      } else {
        this.navbar_white = false
      }
    },
    open_mobile_menus() {
      this.drawer = true
    }
  }
}
</script>

<style scoped>
.navbar_white {
  background-color: white;
}

.navbar_white .navbar-nav > li > a {
  color: #111111 !important;
}

.mobile-menu-root {
  position: relative;
  float: right;
  margin-right: 15px;
  padding: 10px 10px;
  font-size: 20px;
}
@media (min-width: 768px) {
  .mobile-menu-root {
    display: none;
  }
}

.menu-split {
  padding: 25px 0;
}

@media (max-width: 1280px) and (min-width: 1024px) {
  .container {
    width: 98%;
  }
  .zr-gai-nav.navbar-default .navbar-nav > li > a {
    padding: 1.8rem 2rem;
    font-size: 1.5rem;
  }
  .header .language {
    font-size: 1.5rem;
    margin-top: 1.8rem;
  }
  .header .navbar-brand img {
    height: 5.5rem;
  }
}

@media (max-width: 1023px) and (min-width: 992px) {
  .container {
    width: 98%;
  }
  .zr-gai-nav.navbar-default .navbar-nav > li > a {
    padding: 1.8rem 0.6rem;
    font-size: 1.5rem;
  }

  .header .language {
    font-size: 1.5rem;
    margin-top: 1.8rem;
  }

  .header .navbar-brand img {
    height: 5.5rem;
  }
}

@media (max-width: 991px) and (min-width: 768px) {
  .container {
    width: 98%;
  }
  .zr-gai-nav.navbar-default .navbar-nav > li > a {
    padding: 1.9rem 1.2rem;
    font-size: 1.5rem;
  }

  .header .language {
    font-size: 1rem;
    margin-top: 2rem;
  }

  .header .navbar-brand img {
    height: 5.5rem;
  }
}

@media (max-width: 767px) {
  .container {
    width: 98%;
  }
  .zr-gai-nav.navbar-default .navbar-nav > li > a {
    padding: 1.5rem 0.3rem;
    font-size: 1rem;
  }

  .header .language {
    font-size: 1rem;
    margin-top: 2rem;
  }

  .header .navbar-brand img {
    height: 5.5rem;
  }
}
</style>
