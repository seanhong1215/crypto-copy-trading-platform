<template>
  <div class="container_body">
    <div class="left">
      <div class="logo cursor-pointer" @click="to_home">
        <img src="@/assets/c_images/brand-mark.svg" />
      </div>
      <div class="header">
        <h2 style="font-size:2em">{{$t('register.welcome')}}</h2>
      </div>
      <el-form ref="register_form" class="form" :model="formModel" :rules="formRule">
        <el-form-item class="formItem" prop="name">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-input
                type="text"
                style="margin-top:0px"
                v-model.trim="formModel.name"
                class="input"
                :placeholder="$t('rules.entry_nickname')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="formItem" prop="email">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-input
                type="text"
                v-model.trim="formModel.email"
                class="input"
                :placeholder="$t('rules.entry_email')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="formItem" prop="password">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-input
                type="password"
                class="input"
                v-model.trim="formModel.password"
                :placeholder="$t('rules.entry_password')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="formItem" prop="confirmPassword">
          <el-row>
            <el-col :span="24" :xs="24">
              <el-input
                type="password"
                class="input"
                v-model.trim="formModel.confirmPassword"
                :placeholder="$t('rules.entry_confirm_password')"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="formItem formItem_downxy" prop="isSure">
          <el-checkbox v-model="formModel.isSure" />
          <span class="downxy" @click="downXY">{{$t('register.has_read')}}</span>
        </el-form-item>
        <el-button
          type="danger"
          round
          @click="register"
          :loading="registerLoading"
          class="button"
        >{{ $t('register.signup') }}</el-button>
        <p style="text-align: center;padding-top: 10px;">
          <span style="vertical-align: middle;">{{ $t('register.has_account') }}？</span>
          <el-link @click="login" type="primary" :underline="false">{{$t('register.to_login')}}</el-link>
        </p>
      </el-form>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
import store from '@/store'
import Rule from '@/validate'
export default {
  data() {
    const checkConfirmPassword = (rule, value, callback) => {
      if (this.formModel.password !== value) {
        callback(new Error(this.$i18n.t('rules.password_not_same')))
      } else {
        callback()
      }
    }
    const checkSure = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$i18n.t('rules.agree_agreement')))
      } else {
        callback()
      }
    }
    return {
      formModel: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isSure: false
      },
      registerLoading: false, //注册按钮的loading
      formRule: {
        //表单的验证
        password: [
          {
            required: true,
            message: this.$i18n.t('rules.entry_password'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$i18n.t('rules.chars_count', { count: 6 }),
            trigger: 'blur'
          },
          { validator: Rule.checkNull, trigger: 'blur' },
          { validator: Rule.checkTszf, trigger: 'blur' },
          { validator: Rule.checkChinese, trigger: 'blur' }
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$i18n.t('rules.entry_confirm_password'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$i18n.t('rules.chars_count', { count: 6 }),
            trigger: 'blur'
          },
          { validator: Rule.checkNull, trigger: 'blur' },
          { validator: Rule.checkTszf, trigger: 'blur' },
          { validator: Rule.checkChinese, trigger: 'blur' },
          { validator: checkConfirmPassword, trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            message: this.$i18n.t('rules.nickname_not_empty'),
            trigger: 'blur'
          },
          { validator: Rule.checkNull, trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: this.$i18n.t('rules.chars_max_count', { count: 20 }),
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: this.$i18n.t('rules.entry_email'),
            trigger: 'blur'
          },
          { validator: Rule.checkNull, trigger: 'blur' },
          { validator: Rule.checkEmail, trigger: 'blur' }
        ],
        isSure: [{ validator: checkSure, trigger: 'change' }]
      }
    }
  },
  store,
  methods: {
    // 注册（演示用模拟注册，不连接真实后端）
    register() {
      this.$refs.register_form.validate((res) => {
        if (res) {
          if (!this.formModel.isSure) {
            this.$message({
              message: this.$i18n.t('message.accept_agreement'),
              type: 'error'
            })
            return
          }
          this.registerLoading = true
          setTimeout(() => {
            this.registerLoading = false
            this.$message({
              message: this.$i18n.t('message.register_success'),
              type: 'success'
            })
            this.$router.push('/login')
          }, 300)
        }
      })
    },
    downXY() {
      this.$message(this.$t('common.demo_document_notice'))
    },
    login() {
      this.$router.push('/login')
    },
    to_home() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}

.downxy {
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}

body {
  font-family: 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
}

.container_body {
  display: flex;
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
  height: 100vh;
}

.header {
  margin-bottom: 2vh;
  margin-top: 13vh;
}

.header > h2 {
  margin: 0;
  color: #4f46a5;
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

.logo {
  height: 10vh;
  position: absolute;
  top: 5vh;
}

.logo img {
  height: 100%;
}
</style>
