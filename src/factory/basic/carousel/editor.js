export default {
  props: {
    initialIndex: {
      type: Number,
      default: 0,
    },
    height: {
      type: String,
      placeholder: '300px',
    },
    trigger: {
      type: String,
      default: 'hover',
      options: ['hover', 'click'],
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    indicatorPosition: {
      type: String,
      options: ['outside', 'none'],
    },
    indicator: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: String,
      default: 'hover',
      options: ['always', 'hover', 'never'],
    },
    type: {
      type: String,
      options: ['card', 'none'],
    },
    loop: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String,
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      validator(val) {
        return ['horizontal', 'vertical'].indexOf(val) !== -1;
      },
    },
  },
};
