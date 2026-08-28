<template>
  <main class="auth-page">
    <router-link to="/" class="auth-logo" aria-label="返回 FinFolio 首頁"><img src="@/assets/c_images/brand-lockup.svg" alt="FinFolio" /></router-link>

    <section class="auth-intro">
      <div class="intro-inner">
        <span class="demo-label">CREATE YOUR DEMO WORKSPACE</span>
        <h1>建立自己的<br />模擬跟單工作區。</h1>
        <p>不需要真實資金，也不會連接交易所。用一個本機帳戶完整體驗研究、配置與追蹤流程。</p>
        <div class="flow-preview">
          <div class="flow-item active"><span>1</span><p><b>建立帳戶</b><small>輸入基本資料</small></p></div>
          <div class="flow-line"></div>
          <div class="flow-item"><span>2</span><p><b>選擇交易員</b><small>比較績效風險</small></p></div>
          <div class="flow-line"></div>
          <div class="flow-item"><span>3</span><p><b>追蹤組合</b><small>查看模擬損益</small></p></div>
        </div>
      </div>
      <p class="intro-disclaimer">作品集展示用途 · 所有資料只保存在本機</p>
    </section>

    <section class="auth-form-side">
      <div class="auth-card">
        <div class="auth-heading">
          <span>LOCAL DEMO ACCOUNT</span>
          <h2>建立 Demo 帳戶</h2>
          <p>完成後會直接登入，帳戶只存在目前瀏覽器中。</p>
        </div>

        <el-form ref="registerForm" :model="formModel" :rules="formRule" @submit.prevent="register">
          <div class="field-row">
            <el-form-item prop="name">
              <label class="field-label" for="register-name">顯示名稱</label>
              <el-input id="register-name" v-model.trim="formModel.name" autocomplete="name" placeholder="例如：Alex"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <label class="field-label" for="register-email">電子郵件</label>
              <el-input id="register-email" type="email" v-model.trim="formModel.email" autocomplete="email" placeholder="name@example.com"></el-input>
            </el-form-item>
          </div>
          <el-form-item prop="password">
            <label class="field-label" for="register-password">密碼</label>
            <el-input id="register-password" type="password" v-model="formModel.password" autocomplete="new-password" placeholder="至少 6 個字元" show-password></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <label class="field-label" for="register-confirm">確認密碼</label>
            <el-input id="register-confirm" type="password" v-model="formModel.confirmPassword" autocomplete="new-password" placeholder="再次輸入密碼" show-password></el-input>
          </el-form-item>

          <div class="data-notice">
            <i>✓</i>
            <div><b>關於你的 Demo 資料</b><p>資料使用瀏覽器 localStorage 保存，不會送往伺服器；請勿使用真實或慣用密碼。</p></div>
          </div>

          <el-form-item prop="isSure" class="agreement-item">
            <el-checkbox v-model="formModel.isSure">我了解這是模擬平台，並接受風險提示與免責聲明</el-checkbox>
          </el-form-item>
          <el-button native-type="submit" type="primary" class="submit-button" :loading="registerLoading">建立並登入</el-button>
        </el-form>

        <p class="auth-switch">已經有帳戶？<router-link to="/login">返回登入</router-link></p>
      </div>
    </section>
  </main>
</template>

<script>
import Rule from '@/validate'

export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value !== this.formModel.password) callback(new Error('兩次輸入的密碼不一致'))
      else callback()
    }
    const acceptAgreement = (rule, value, callback) => {
      if (!value) callback(new Error('請先確認 Demo 與風險聲明'))
      else callback()
    }
    return {
      registerLoading: false,
      formModel: { name: '', email: '', password: '', confirmPassword: '', isSure: false },
      formRule: {
        name: [
          { required: true, message: '請輸入顯示名稱', trigger: 'blur' },
          { min: 1, max: 20, message: '名稱長度需在 1 至 20 個字元', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入電子郵件', trigger: 'blur' },
          { validator: Rule.checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, message: '密碼至少需要 6 個字元', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '請再次輸入密碼', trigger: 'blur' },
          { validator: confirmPassword, trigger: 'blur' }
        ],
        isSure: [{ validator: acceptAgreement, trigger: 'change' }]
      }
    }
  },
  methods: {
    register() {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) return
        this.registerLoading = true
        try {
          await this.$store.dispatch('register', {
            email: this.formModel.email,
            name: this.formModel.name,
            password: this.formModel.password
          })
          this.$message.success('Demo 帳戶建立完成')
          this.$router.push('/leaderboard')
        } catch (e) {
          this.$message.error(e.code === 'email_taken' ? '此電子郵件已建立 Demo 帳戶' : '暫時無法建立帳戶')
        } finally {
          this.registerLoading = false
        }
      })
    }
  },
  mounted() {
    if (this.$store.state.TOKEN) this.$router.replace('/following')
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(560px, 1.1fr); background: #f8fafc; position: relative; }
.auth-logo { position: absolute; z-index: 3; top: 34px; left: 42px; }.auth-logo img { width: 150px; height: auto; }
.auth-intro { min-height: 100vh; position: relative; display: flex; align-items: center; color: #fff; padding: 110px 70px 70px; overflow: hidden; background: linear-gradient(145deg, #12233e 0%, #173c68 58%, #135d58 120%); }
.auth-intro:before, .auth-intro:after { content: ''; position: absolute; border: 1px solid rgba(255,255,255,.09); border-radius: 50%; }.auth-intro:before { width: 430px; height: 430px; right: -220px; top: -110px; }.auth-intro:after { width: 300px; height: 300px; left: -160px; bottom: -130px; }
.intro-inner { max-width: 520px; position: relative; z-index: 1; }.demo-label { color: #8edbc0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; }
.intro-inner h1 { margin: 20px 0; font-size: 39px; line-height: 1.35; letter-spacing: -1px; }.intro-inner > p { color: rgba(255,255,255,.68); font-size: 15px; line-height: 1.8; max-width: 440px; }
.flow-preview { margin-top: 50px; }.flow-item { display: flex; align-items: center; gap: 13px; }.flow-item > span { width: 34px; height: 34px; flex: 0 0 34px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.28); border-radius: 50%; color: rgba(255,255,255,.68); font-weight: 700; }
.flow-item.active > span { color: #153b57; background: #8edbc0; border-color: #8edbc0; }.flow-item p { margin: 0; }.flow-item b, .flow-item small { display: block; }.flow-item b { font-size: 13px; }.flow-item small { color: rgba(255,255,255,.5); font-size: 10px; margin-top: 3px; }.flow-line { width: 1px; height: 23px; background: rgba(255,255,255,.2); margin: 4px 0 4px 17px; }
.intro-disclaimer { position: absolute; left: 70px; bottom: 32px; color: rgba(255,255,255,.42); font-size: 11px; }
.auth-form-side { min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 60px 40px; }.auth-card { width: 100%; max-width: 500px; }
.auth-heading > span { color: var(--brand-primary); font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }.auth-heading h2 { color: #14233a; font-size: 28px; margin: 10px 0 8px; }.auth-heading p { color: #7a8596; line-height: 1.6; margin-bottom: 24px; }
.field-row { display: grid; grid-template-columns: .75fr 1.25fr; gap: 14px; }.field-label { display: block; color: #344258; font-size: 12px; font-weight: 600; margin-bottom: 7px; line-height: 1; }
.data-notice { display: flex; gap: 11px; background: #eef5fc; border: 1px solid #d7e5f4; padding: 12px 14px; border-radius: 8px; margin: 4px 0 18px; color: #607089; }.data-notice > i { color: var(--brand-primary); margin-top: 2px; }.data-notice b { display: block; color: #354966; font-size: 11px; }.data-notice p { margin: 4px 0 0; line-height: 1.5; font-size: 10px; }
.agreement-item { margin-bottom: 18px; }.submit-button { width: 100%; height: 44px; border-radius: 7px; background: var(--brand-primary); border-color: var(--brand-primary); font-weight: 600; }.submit-button:hover { background: var(--brand-primary-hover); border-color: var(--brand-primary-hover); }
.auth-switch { text-align: center; color: #808a99; margin: 22px 0 0; }.auth-switch a { color: var(--brand-primary); font-weight: 600; margin-left: 4px; }
@media (max-width: 900px) {
  .auth-page { grid-template-columns: 1fr; }.auth-intro { min-height: auto; padding: 108px 28px 42px; }.intro-inner { margin: auto; text-align: center; }.intro-inner h1 { font-size: 30px; }.intro-inner > p { margin: auto; }.flow-preview, .intro-disclaimer { display: none; }
  .auth-logo { top: 25px; left: 26px; }.auth-logo img { width: 130px; }.auth-form-side { min-height: auto; padding: 42px 22px 60px; }.auth-card { max-width: 520px; }
}
@media (max-width: 560px) { .field-row { grid-template-columns: 1fr; gap: 0; } }
</style>
