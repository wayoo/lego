export default {
  props: {
    size: {
      type: String,
      options: ['large', 'small', 'mini'],
    },
    type: {
      type: String,
      options: [
        'year', 'month', 'date', 'dates',
        'week', 'datetime', 'datetimerange',
        'daterange', 'monthrange',
      ],
      forceUpdate: true,
    },
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
      type: String,
      default: 'el-icon-circle-close',
    },
    name: {
      default: '',
    },
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true,
    },
    id: {
      default: '',
    },
    popperClass: String,
    editable: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: 'left',
      options: ['left', 'center', 'right'],
    },
    value: {},
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
      default: '-',
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    validateEvent: {
      type: Boolean,
      default: true,
    },
  },
  events: {
    'change': {
      type: 'Function',
      value: `function (val) {
  this.$notify.info({
      message: '当前时间' + val
  });
}
      `,
    },
    'blur': {
      type: 'Function',
    },
    'focus': {
      type: 'Function',
    },
  },
};
