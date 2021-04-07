export default {
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    small: Boolean,
    total: Number,
    pageCount: Number,
    pagerCount: {
      type: Number,
      validator(value) {
        return (value || 0) === value && value > 4 && value < 22 && (value % 2) === 1;
      },
      default: 7,
    },
    // layout: {
    //   default: 'prev, pager, next, jumper, ->, total',
    // },
    pageSizes: {
      type: Array,
      placeholder: '[10, 20, 30, 40, 50, 100]',
      // default() {
      //   return [10, 20, 30, 40, 50, 100];
      // },
    },
    // popperClass: String,
    prevText: String,
    nextText: String,
    background: Boolean,
    disabled: Boolean,
    // hideOnSinglePage: Boolean,
  },
  events: {
    'current-change': {
      type: 'Function',
      value: `function (val) {
    this.tmpl.val = val;
    this.$notify.info({
        message: '当前页面' + val
    });
}`,
    },
    'prev-click': {
      type: 'Function',
    },
    'next-click': {
      type: 'Function',
    },
  },
};
