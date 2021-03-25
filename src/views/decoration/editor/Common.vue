<template>
  <div>
    <el-form-item
      :label="item.label || k"
      :key="k"
      v-for="(item, k) in confList"
    >
      <el-input
        v-if="item === Number || item.type === Number
          || ((item === String || item.type === String) && !item.options)"
        v-model="form[k]"
        :placeholder="item.placeholder"
        @keydown.enter.native="onConfChange(k, form[k])"
        @blur="onConfChange(k, form[k])"
      >
      </el-input>

      <el-input
        v-if="item === Array || item.type === Array"
        v-model="form[k]"
        :placeholder="item.placeholder"
        @keydown.enter.native="onConfChange(k, form[k])"
        @blur="onConfChange(k, form[k])"
      >
      </el-input>

      <el-switch
        v-if="item === Boolean || item.type === Boolean"
        v-model="form[k]"
        @change="onConfChange(k, ...arguments)"
      >
      </el-switch>

      <el-select v-if="item.options"
        v-model="form[k]" placeholder="请选择"
        @change="onConfChange(k, form[k])"
        >
        <el-option
          v-for="_item in item.options"
          :key="_item"
          :label="_item"
          :value="_item">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
const propertyKey = 'props';
const confList = {
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
  currentPage: {
    type: Number,
    default: 1,
  },
  layout: {
    default: 'prev, pager, next, jumper, ->, total',
  },
  pageSizes: {
    type: Array,
    placeholder: '[10, 20, 30, 40, 50, 100]',
    // default() {
    //   return [10, 20, 30, 40, 50, 100];
    // },
  },
  popperClass: String,
  prevText: String,
  nextText: String,
  background: Boolean,
  disabled: Boolean,
  hideOnSinglePage: Boolean,
};

function restorePreviousValue(target, source) {
  // restore previous conf
  // eslint-disable-next-line
    for (const k in confList) {
    const val = source[propertyKey] && source[propertyKey][k];

    // if (val) {

    // }

    // eslint-disable-next-line no-param-reassign
    target[k] = val !== undefined ? val : confList[k].default;
  }
  return target;
}

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    // used to modify comp.dataProvider
    const form = restorePreviousValue({}, this.data);

    return {
      confList,
      form,
    };
  },
  methods: {
    onConfChange(k, val) {
      // eslint-disable-next-line
      // console.log(arguments);
      if (confList[k].type === Number || confList[k] === Number) {
        // eslint-disable-next-line
        val = val - 0;
      }
      if (confList[k].type === Array || confList[k] === Array) {
        try {
          // eslint-disable-next-line
          val = eval(val);
        } catch (e) {
          console.log(e);
        }
      }

      if (!this.data[propertyKey]) {
        this.data[propertyKey] = {};
      }

      this.data[propertyKey][k] = val;
      this.$emit('change');
    },
  },
};
</script>
