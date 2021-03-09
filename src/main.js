import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(ElementUI);

Vue.prototype.$api = {};
Vue.prototype.$api.dynamicPages = {
  // eslint-disable-next-line arrow-body-style
  get: (params) => {
    // eslint-disable-next-line arrow-body-style
    return axios.get(`https://hrss-api.dev2.wdeduc.com/modular/admin/v1/block/getBlockForClick?pageId=${params.pageId}`).then((res) => {
      return res.data;
    });
  },
};
// Vue.mixin({
//   methods: {
//     sendBridgeMessage(data) {
//       this.$root.$emit('send-bridge-message', data);
//     },
//   },
// });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
