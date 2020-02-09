import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import drr from '@minogin/vue-drag-resize-rotate'

Vue.config.productionTip = false
Vue.component('drr', drr)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
