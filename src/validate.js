import i18n from '@/i18n/i18n'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  checkEmail(rule, value, callback) {
    if (!emailPattern.test(String(value || '').trim())) {
      callback(new Error(i18n.global.t('rules.entry_email_wrong')))
      return
    }
    callback()
  }
}
