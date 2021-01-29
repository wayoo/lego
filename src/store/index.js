import Vue from 'vue';
import Vuex from 'vuex';
import editor from './editor';
import workspace from './workespace';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    editor,
    workspace,
  },
});
