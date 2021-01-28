// @see https://git.corp.wdeduc.com/wcda-old-project/saas-mis-fe/-/blob/master/src/store/module/app.js
// import Vue from 'vue';

export default {
  state: {
    blockData: {
    },
  },
  mutations: {
    setBlockData(state, data) {
      state.blockData = { ...data };
    },
  },
};
