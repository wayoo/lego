import Vue from 'vue';
import Vuex from 'vuex';
import workspace from './workespace';
import client from './client';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    workspace,
    client,
  },
});
