// @see https://git.corp.wdeduc.com/wcda-old-project/saas-mis-fe/-/blob/master/src/store/module/app.js
// @see https://gist.github.com/DawidMyslak/2b046cca5959427e8fb5c1da45ef7748
// import Vue from 'vue';
import Messenger from '../common/messenger';

const msgr = new Messenger('#work-frame');

export default {
  state: {
    blockData: {
    },
  },
  mutations: {
    setBlockData(state, data) {
      state.blockData = { ...state.blockData, ...data };
    },
  },
  actions: {
    syncBlockData({ state }, data) {
      msgr.sendMessage({
        action: 'update_block_data',
        data: {
          id: state.blockData.id,
          ...data,
        },
      }).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    },
  },
};
