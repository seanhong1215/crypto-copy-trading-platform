import store from '@/store'
import router from '@/router'
import i18n from '@/i18n/i18n'
import { ElMessage } from 'element-plus'

// 需要登入的操作統一由此處處理；未登入時顯示提示並導向登入頁。
export default function requireLogin(fn) {
  if (store.state.TOKEN) {
    fn()
  } else {
    ElMessage.warning(i18n.global.t('message.please_login'))
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
  }
}
