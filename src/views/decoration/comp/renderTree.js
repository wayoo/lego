import { mapState } from 'vuex';

let nestedLevel = 0;

export default {
  computed: {
    ...mapState({
      compList: (state) => state.workspace.compList,
    }),
  },
  methods: {
    renderConfig(h, data) {
      if (!data) { return console.error('no data'); }
      let childNodes = [];

      if (data.children) {
        nestedLevel += 1;
        childNodes = data.children.map((n) => this.renderConfig(h, n));
        nestedLevel -= 1;
      }

      const option = {};
      childNodes.unshift(h('div', {
        style: {
          borderLeft: '1px solid #ccc',
        },
      }, [
        h('span', '    '.repeat(nestedLevel)),
        h('span', data.name),
      ]));
      return h('div', option, childNodes);
    },
  },
  render(h) {
    const childNodes = this.compList.map((n) => this.renderConfig(h, n));
    const result = h('div', {
      style: {
        fontSize: '14px',
        whiteSpace: 'pre',
      },
    }, childNodes);
    return result;
  },
};
