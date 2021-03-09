export default {
  state: {
    placeholder: {
      blockInfo: {},
      direction: '',
      display: false,
      isInside: false,
      isValid: true,
    },
    activeComp: {
      blockInfo: {},
    },
  },
  mutations: {
    setClientPlaceholder(state, data) {
      state.placeholder.blockInfo = data.blockInfo;
      state.placeholder.direction = data.direction;
      state.placeholder.isInside = data.isInside;
      state.placeholder.isValid = data.isValid;
      // Vue.set(state.placeholder, 'blockInfo', data.blockInfo);
      // Vue.set(state.placeholder, 'direction', data.direction);
      // state.placeholder = { ...data };
    },
    resetClientPlaceholder(state) {
      state.placeholder.blockInfo = {};
      state.placeholder.direction = '';
      state.placeholder.display = false;
      state.placeholder.isInside = false;
    },
    hideClientPlaceholder(state) {
      state.placeholder.display = false;
    },
    showClientPlaceholder(state) {
      state.placeholder.display = true;
    },
    setClientActiveComp(state, data) {
      state.activeComp.blockInfo = data;
    },
    // setBlockData(state, data) {
    //   state.blockData = { ...data };
    // },
  },
};
