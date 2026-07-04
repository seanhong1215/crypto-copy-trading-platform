import store from '@/store'
import router from '@/router'
import i18n from '@/i18n/i18n'

// Follow 等需要登录的操作统一走这里；未登录则提示并导向登录页
export default function requireLogin(fn) {
  if (store.state.TOKEN) {
    fn()
  } else {
    ELEMENT.Message.warning(i18n.tc('message.please_login'))
    router.push('/login')
  }
}
