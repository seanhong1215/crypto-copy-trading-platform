import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh_CN from './zh_CN'

Vue.use(VueI18n)

// 多语系暂时停用，先以中文为主显示
const messages = { zh_CN }

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
    locale: 'zh_CN', // 固定为中文
    messages, // 设置地区信息
})
  
  
export default i18n;