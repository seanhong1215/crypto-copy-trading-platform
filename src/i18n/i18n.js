import { createI18n } from 'vue-i18n'
import zhTW from './zh_TW'

const i18n = createI18n({
  legacy: true,
  locale: 'zh-TW',
  fallbackLocale: 'zh-TW',
  messages: { 'zh-TW': zhTW }
})

// Legacy validators still call tc(); the project has no plural-specific rules.
i18n.tc = (...args) => i18n.global.t(...args)

export default i18n
