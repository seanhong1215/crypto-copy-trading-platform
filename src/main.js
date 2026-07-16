// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import router from './router/index'
import App from './App'
import store from './store/index.js'

import util from './util'
import i18n from './i18n/i18n'

// import ELEMENT  from 'element-ui'

Date.prototype.Format = function(fmt)
{
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
Vue.use(util);
Vue.use(ELEMENT );
Vue.config.productionTip = false;
new Vue({
    el: '#app',
    router, store,
    components: { App },
    template: '<App/>',
    i18n
});

// 带 token 重新整理时，从后端重新载入跟单设定（失败静默，不阻断页面）
if (store.state.TOKEN) {
    store.dispatch('loadFollows').catch(() => {});
}

