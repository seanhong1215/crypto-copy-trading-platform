<template>
  <div class="container_body">
    <div class="left">
      <div class="logo cursor-pointer" @click="to_home">
        <img src="@/assets/c_images/brand-mark.svg" />
      </div>
      <div class="header">
        <h2 style="font-size:2em">{{ $t('login.welcome') }}</h2>
        <h4>{{ $t('login.login_tip') }}</h4>
      </div>
      <el-form ref="form" class="form" :model="formModel" :rules="formRule">
        <el-form-item class="formItem" prop="cellPhone">
          <input
            style="margin-top:0px"
            type="email"
            class="form-field"
            v-model="formModel.cellPhone"
            :placeholder="$t('login.login_placeholder')"
          />
        </el-form-item>
        <el-form-item class="formItem" prop="password">
          <input
            type="password"
            class="form-field"
            v-model="formModel.password"
            :placeholder="$t('common.password')"
          />
        </el-form-item>
        <p>
          <el-checkbox
            class="pull-left"
            v-model="formModel.isSavePassword"
          >{{$t('login.remember_password')}}</el-checkbox>
        </p>
        <el-button :loading="loginLoading" @click="login">{{$t('login.menu')}}</el-button>
        <p
          style="
                    text-align: center;
                    padding-top: 10px;
                "
        >
          <span style="vertical-align: middle;">{{$t('login.no_account')}}？</span>
          <el-link @click="register" type="primary" :underline="false">{{$t('login.to_register')}}</el-link>
        </p>
      </el-form>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import Rule from '@/validate'
import store from '@/store'
import register from './register_new.vue'

export default {
  components: { register },
  data() {
    return {
      formModel: { cellPhone: '', password: '', isSavePassword: false }, //表单的的Model
      loginLoading: false, //登陆按钮的loading
      formRule: {
        //表单的验证
        cellPhone: [
          {
            required: true,
            message: this.$i18n.t('login.entry_login'),
            trigger: 'blur'
          },
          { validator: Rule.checkNull, trigger: 'blur' }
          // { validator: Rule.checkTszf, trigger: 'blur' },
          // { validator: Rule.checkCellPhone, trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: this.$i18n.t('login.entry_password'),
            trigger: 'blur'
          },
          { min: 6, message: this.$i18n.t('rules.six_chars'), trigger: 'blur' },
          { validator: Rule.checkNull, trigger: 'blur' },
          { validator: Rule.checkTszf, trigger: 'blur' },
          { validator: Rule.checkChinese, trigger: 'blur' }
        ]
      }
    }
  },
  store,
  methods: {
    // 登陆（呼叫真实后端：bcrypt 验证 + JWT）
    login() {
      this.$refs.form.validate(async (res) => {
        if (!res) return
        this.loginLoading = true
        try {
          await this.$store.dispatch('login', {
            email: this.formModel.cellPhone,
            password: this.formModel.password
          })
          // 安全性：只记住 email，绝不将密码写入 localStorage
          if (this.formModel.isSavePassword) {
            localStorage.setItem('saved_email', this.formModel.cellPhone)
          } else {
            localStorage.removeItem('saved_email')
          }
          this.$message({
            message: this.$i18n.t('message.login_success'),
            type: 'success',
            showClose: true,
            center: true
          })
          this.$router.push('/')
        } catch (e) {
          this.$message.error(this.$i18n.t('message.login_failed'))
        } finally {
          this.loginLoading = false
        }
      })
    },
    register() {
      this.$router.push('/register')
    },
    to_home() {
      this.$router.push('/')
    }
  },
  mounted() {
    if (this.$store.state.TOKEN) {
      this.$router.push('/')
    }
    // 清除旧版可能存下的明文密码（acpsd 内含 password）
    localStorage.removeItem('acpsd')
    // 只回填 email，不回填密码
    const savedEmail = localStorage.getItem('saved_email')
    if (savedEmail) {
      this.formModel.cellPhone = savedEmail
      this.formModel.isSavePassword = true
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
}

.container_body {
  display: flex;
  /* new */
  /* height: 200vh; */
}

.left {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  padding: 20px 60px;
  width: 440px;
}

.right {
  flex: 1;
  background-color: black;
  transition: 1s;
  background-image: url(~@/assets/c_images/login.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  /* new */
  height: 100vh;
}

.header > h2 {
  margin: 0;
  color: var(--ink-primary);
}

.header > h4 {
  margin-top: 10px;
  font-weight: normal;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.4);
}

.form {
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.form > p {
  font-size: 14px;
  text-align: right;
}

.form-field {
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 1px solid var(--border-hairline);
  border-radius: 6px;
  font-family: 'Rubik', sans-serif;
  outline: 0;
  transition: 0.2s;
  margin-top: 20px;
}

.form-field:focus {
  border-color: var(--brand-primary);
}

.form > button {
  padding: 12px 10px;
  border: 0;
  background: var(--brand-primary);
  border-radius: 6px;
  margin-top: 10px;
  color: #fff;
  letter-spacing: 1px;
  font-family: 'Rubik', sans-serif;
  cursor: pointer;
  transition: background-color 120ms ease;
}

.form > button:hover {
  background: var(--brand-primary-hover);
}

.header {
  margin-bottom: 2vh;
  margin-top: 8vh;
}

.logo {
  height: 10vh;
  position: absolute;
  top: 15vh;
}

.logo img {
  height: 100%;
}

.logo-r {
  height: 80px;
  position: absolute;
  top: 10px;
  right: 20px;
}

.logo-r img {
  height: 100%;
}
</style>