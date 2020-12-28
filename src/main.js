import Vue from 'vue'
import VueCodemirror from "vue-codemirror/src";
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import less from 'less'
import './assets/css/global.css'   //导入全局样式表
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false;
Vue.use(VueCodemirror,);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
