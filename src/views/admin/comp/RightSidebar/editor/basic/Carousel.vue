<template>
  <div>
    <div v-if="data.rootElem">
      <!-- <el-form-item label="自动播放">
        <el-switch
          v-model="form.autoplay" @change="onChange">
        </el-switch>
      </el-form-item> -->
      <el-form-item :label="k"
        :key="k"
        v-for="(item, k) in propsList">
        <el-switch v-if="item.type === Boolean"
          v-model="form[k]"
          @change="onPropsChange(k, ...arguments)">
        </el-switch>
        <el-input v-if="item.type === Number || (item.type === String && !item.options)"
          v-model="form[k]"
          :placeholder="item.placeholder"
          @keydown.enter.native="onPropsChange(k, form[k])"
          @blur="onPropsChange(k, form[k])"
          >
        </el-input>
        <el-select v-if="item.options"
          v-model="form[k]" placeholder="请选择"
          @change="onPropsChange(k, form[k])"
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
  </div>
</template>

<script>
const props = {
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
};

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    console.log(this.data);
    const form = {};

    // eslint-disable-next-line
    for (const k in props) {
      const val = this.data.props && this.data.props[k];
      form[k] = val !== undefined ? val : props[k].default;
    }

    return {
      propsList: props,
      form,
      // form: {
      //   autoplay: this.data.props.autoplay,
      // },
    };
  },
  methods: {
    onChange(val) {
      this.data.props.autoplay = val;
      this.$emit('change');
    },
    onBlur(e) {
      console.log(e);
    },
    onPropsChange(k, val) {
      // eslint-disable-next-line
      // console.log(arguments);
      if (props[k].type === Number) {
        // eslint-disable-next-line
        val = val - 0;
      }
      console.log('xxxxxx');
      this.data.props[k] = val;
      this.$emit('change');
    },
  },
};
</script>
