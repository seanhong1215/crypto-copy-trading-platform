import { createApp } from 'vue'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'nprogress/nprogress.css'
import './assets/css/app.css'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n/i18n'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.config.globalProperties.$message = ElMessage
app.mount('#app')

if (store.state.TOKEN) {
  store.dispatch('loadFollows').catch(() => {})
}
