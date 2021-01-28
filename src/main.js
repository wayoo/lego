import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-theme-dark';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(ElementUI);

Vue.mixin({
  methods: {
    sendBridgeMessage(data) {
      this.$root.$emit('send-bridge-message', data);
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
