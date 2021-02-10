export default {
  state: {
    placeholder: {
      blockInfo: {},
      direction: '',
      display: false,
      isInside: false,
      isValid: true,
    },
  },
  mutations: {
    setPlaceholder(state, data) {
      state.placeholder.blockInfo = data.blockInfo;
      state.placeholder.direction = data.direction;
      state.placeholder.isInside = data.isInside;
      state.placeholder.isValid = data.isValid;
    },
    hidePlaceholder(state) {
      state.placeholder.display = false;
    },
    showPlaceholder(state) {
      state.placeholder.display = true;
    },
  },
};
