export default {
  state: {
    placeholder: {
      blockInfo: {},
      direction: '',
      display: false,
    },
  },
  mutations: {
    setPlaceholder(state, data) {
      state.placeholder.blockInfo = data.blockInfo;
      state.placeholder.direction = data.direction;
      // Vue.set(state.placeholder, 'blockInfo', data.blockInfo);
      // Vue.set(state.placeholder, 'direction', data.direction);
      // state.placeholder = { ...data };
    },
    hidePlaceholder(state) {
      state.placeholder.display = false;
    },
    showPlaceholder(state) {
      state.placeholder.display = true;
    },
    // setBlockData(state, data) {
    //   state.blockData = { ...data };
    // },
  },
};
