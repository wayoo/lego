function getParameterByName(name, url = window.location.href) {
  // eslint-disable-next-line no-param-reassign
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default {
  state: {
    hostname: getParameterByName('site') || 'localhost:8081',
    placeholder: {
      blockInfo: {},
      direction: '',
      display: false,
      isInside: false,
      isValid: true,
    },
    outline: {
      blockInfo: {},
      display: false,
    },
  },
  mutations: {
    stateSetOutline(state, data) {
      // state.outline = { ...state.outline, ...data };
      state.outline.blockInfo = data.blockInfo;
      state.outline.display = data.display;
    },
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
    stateShowOutline(state) {
      state.outline.display = true;
    },
    stateHideOutline(state) {
      state.outline.display = false;
    },
    storeSetHostname(state, data) {
      state.hostname = data;
    },
  },
};
