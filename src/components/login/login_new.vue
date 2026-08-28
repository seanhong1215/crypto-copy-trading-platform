<template>
  <main class="auth-page">
    <router-link to="/" class="auth-logo" aria-label="返回 FinFolio 首頁">
      <img src="@/assets/c_images/brand-lockup.svg" alt="FinFolio" />
    </router-link>

    <section class="auth-intro">
      <div class="intro-inner">
        <span class="demo-label">FRONTEND PORTFOLIO DEMO</span>
        <h1>歡迎回來，<br />繼續追蹤你的模擬組合。</h1>
        <p>登入後可儲存跟單設定、查看組合損益與接收模擬交易通知。</p>
        <div class="intro-points">
          <div><i>↗</i><span><b>組合績效</b><small>集中查看跟單損益與資金曲線</small></span></div>
          <div><i>✓</i><span><b>純前端展示</b><small>資料只保存在目前瀏覽器</small></span></div>
          <div><i>↻</i><span><b>隨時重設</b><small>清除網站資料即可重新體驗</small></span></div>
        </div>
      </div>
      <p class="intro-disclaimer">作品集展示用途 · 不涉及真實資金或交易</p>
    </section>

    <section class="auth-form-side">
      <div class="auth-card">
        <div class="auth-heading">
          <span>ACCOUNT ACCESS</span>
          <h2>登入 Demo 帳戶</h2>
          <p>使用 Demo 帳號快速體驗，或登入你在此瀏覽器建立的帳戶。</p>
        </div>

        <button type="button" class="demo-login" :disabled="loginLoading" @click="loginAsDemo">
          <span class="demo-avatar">D</span>
          <span><b>一鍵使用 Demo 帳號</b><small>已準備好範例登入資料</small></span>
          <i>→</i>
        </button>

        <div class="divider"><span>或使用帳號登入</span></div>

        <el-form ref="form" :model="formModel" :rules="formRule" @submit.prevent="login">
          <el-form-item prop="cellPhone">
            <label class="field-label" for="login-email">電子郵件</label>
            <el-input id="login-email" type="email" v-model.trim="formModel.cellPhone" autocomplete="email" placeholder="name@example.com"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <label class="field-label" for="login-password">密碼</label>
            <el-input id="login-password" type="password" v-model="formModel.password" autocomplete="current-password" placeholder="至少 6 個字元" show-password></el-input>
          </el-form-item>
          <div class="form-options">
            <el-checkbox v-model="formModel.isSavePassword">記住電子郵件</el-checkbox>
            <span>Demo 無忘記密碼流程</span>
          </div>
          <el-button native-type="submit" type="primary" class="submit-button" :loading="loginLoading">登入帳戶</el-button>
        </el-form>

        <p class="auth-switch">還沒有帳戶？<router-link to="/register">建立 Demo 帳戶</router-link></p>
        <p class="storage-note"><i>i</i> 帳戶與跟單資料僅儲存在本機瀏覽器，不會上傳個人資料。</p>
      </div>
    </section>
  </main>
</template>

<script>
import Rule from '@/validate'

export default {
  data() {
    return {
      loginLoading: false,
      formModel: { cellPhone: '', password: '', isSavePassword: false },
      formRule: {
        cellPhone: [
          { required: true, message: '請輸入電子郵件', trigger: 'blur' },
          { validator: Rule.checkEmail, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, message: '密碼至少需要 6 個字元', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitCredentials(email, password) {
      this.loginLoading = true
      try {
        await this.$store.dispatch('login', { email, password })
        if (this.formModel.isSavePassword) localStorage.setItem('saved_email', email)
        else localStorage.removeItem('saved_email')
        this.$message.success('登入成功，歡迎回來')
        this.$router.push(this.$route.query.redirect || '/following')
      } catch (e) {
        this.$message.error('登入失敗，請檢查電子郵件或密碼')
      } finally {
        this.loginLoading = false
      }
    },
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) this.submitCredentials(this.formModel.cellPhone, this.formModel.password)
      })
    },
    loginAsDemo() {
      this.formModel.cellPhone = 'demo@finfolio.app'
      this.formModel.password = 'demo123'
      this.submitCredentials(this.formModel.cellPhone, this.formModel.password)
    }
  },
  mounted() {
    if (this.$store.state.TOKEN) {
      this.$router.replace('/following')
      return
    }
    localStorage.removeItem('acpsd')
    const savedEmail = localStorage.getItem('saved_email')
    if (savedEmail) {
      this.formModel.cellPhone = savedEmail
      this.formModel.isSavePassword = true
    }
  }
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(520px, 1.1fr); background: #f8fafc; position: relative; }
.auth-logo { position: absolute; z-index: 3; top: 34px; left: 42px; }.auth-logo img { width: 150px; height: auto; }
.auth-intro { min-height: 100vh; position: relative; display: flex; align-items: center; color: #fff; padding: 110px 70px 70px; overflow: hidden; background: linear-gradient(145deg, #12233e 0%, #173c68 58%, #135d58 120%); }
.auth-intro:before, .auth-intro:after { content: ''; position: absolute; border: 1px solid rgba(255,255,255,.09); border-radius: 50%; }
.auth-intro:before { width: 430px; height: 430px; right: -220px; top: -110px; }.auth-intro:after { width: 300px; height: 300px; left: -160px; bottom: -130px; }
.intro-inner { max-width: 520px; position: relative; z-index: 1; }.demo-label { color: #8edbc0; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; }
.intro-inner h1 { margin: 20px 0; font-size: 39px; line-height: 1.35; letter-spacing: -1px; }.intro-inner > p { color: rgba(255,255,255,.68); font-size: 15px; line-height: 1.8; max-width: 440px; }
.intro-points { margin-top: 42px; display: grid; gap: 22px; }.intro-points > div { display: flex; align-items: center; gap: 14px; }
.intro-points > div > i { width: 42px; height: 42px; flex: 0 0 42px; display: grid; place-items: center; border-radius: 10px; background: rgba(255,255,255,.1); color: #8edbc0; font-size: 18px; }
.intro-points b, .intro-points small { display: block; }.intro-points b { font-size: 13px; }.intro-points small { color: rgba(255,255,255,.55); margin-top: 4px; font-size: 11px; }
.intro-disclaimer { position: absolute; left: 70px; bottom: 32px; color: rgba(255,255,255,.42); font-size: 11px; }
.auth-form-side { min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 70px 40px; }.auth-card { width: 100%; max-width: 430px; }
.auth-heading > span { color: var(--brand-primary); font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }.auth-heading h2 { color: #14233a; font-size: 28px; margin: 10px 0 8px; }.auth-heading p { color: #7a8596; line-height: 1.6; margin-bottom: 24px; }
.demo-login { width: 100%; border: 1px solid #cfe0f4; background: #f0f6fd; border-radius: 10px; padding: 13px 15px; display: flex; align-items: center; text-align: left; color: #1d3555; cursor: pointer; transition: .16s ease; }
.demo-login:hover { border-color: var(--brand-primary); background: #eaf3fd; }.demo-login:disabled { opacity: .6; cursor: wait; }.demo-avatar { width: 36px; height: 36px; flex: 0 0 36px; display: grid; place-items: center; border-radius: 9px; color: #fff; background: var(--brand-primary); font-weight: 700; margin-right: 11px; }
.demo-login > span:nth-child(2) { flex: 1; }.demo-login b, .demo-login small { display: block; }.demo-login b { font-size: 13px; }.demo-login small { color: #74859b; font-size: 10px; margin-top: 3px; }
.divider { display: flex; align-items: center; color: #99a2af; font-size: 10px; margin: 22px 0; }.divider:before, .divider:after { content: ''; height: 1px; background: #e1e6ed; flex: 1; }.divider span { padding: 0 12px; }
.field-label { display: block; color: #344258; font-size: 12px; font-weight: 600; margin-bottom: 7px; line-height: 1; }.form-options { display: flex; justify-content: space-between; align-items: center; color: #9aa2af; font-size: 10px; margin: -4px 0 22px; }
.submit-button { width: 100%; height: 44px; border-radius: 7px; background: var(--brand-primary); border-color: var(--brand-primary); font-weight: 600; }.submit-button:hover { background: var(--brand-primary-hover); border-color: var(--brand-primary-hover); }
.auth-switch { text-align: center; color: #808a99; margin: 22px 0; }.auth-switch a { color: var(--brand-primary); font-weight: 600; margin-left: 4px; }.storage-note { color: #8b95a3; background: #f1f3f6; border-radius: 7px; padding: 10px 12px; font-size: 10px; line-height: 1.5; }.storage-note i { margin-right: 5px; }
@media (max-width: 900px) {
  .auth-page { grid-template-columns: 1fr; }.auth-intro { min-height: auto; padding: 108px 28px 42px; }.intro-inner { margin: auto; text-align: center; }.intro-inner h1 { font-size: 30px; }.intro-inner > p { margin: auto; }.intro-points, .intro-disclaimer { display: none; }
  .auth-logo { top: 25px; left: 26px; }.auth-logo img { width: 130px; }.auth-form-side { min-height: auto; padding: 42px 22px 60px; }.auth-card { max-width: 500px; }
}
</style>
