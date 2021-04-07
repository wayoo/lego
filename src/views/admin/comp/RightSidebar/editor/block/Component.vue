<template>
  <div>
    <el-form-item
      :label="item.label || k"
      :key="k"
      v-for="(item, k) in confList"
    >
      <el-input v-if="item.type === Number || (item.type === String && !item.options)"
        v-model="form[k]"
        :placeholder="item.placeholder"
        @keydown.enter.native="onConfChange(k, form[k])"
        @blur="onConfChange(k, form[k])"
      >
      </el-input>
      <el-switch
        v-if="item.type === Boolean"
        v-model="form[k]"
        @change="onConfChange(k, ...arguments)"
      >
      </el-switch>
    </el-form-item>
  </div>
</template>

<script>
const propertyKey = 'props';
const confList = {
  enable: {
    label: '是否启用',
    type: Boolean,
    default: false,
  },
  source: {
    label: '数据',
    type: String,
  },
};

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    // used to modify comp.dataProvider
    const form = {};
    console.log(this.data);

    // restore previous conf
    // eslint-disable-next-line
    for (const k in confList) {
      const val = this.data[propertyKey] && this.data[propertyKey][k];
      form[k] = val !== undefined ? val : confList[k].default;
    }

    return {
      confList,
      form,
    };
  },
  methods: {
    onConfChange(k, val) {
      // eslint-disable-next-line
      // console.log(arguments);
      if (confList[k].type === Number) {
        // eslint-disable-next-line
        val = val - 0;
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
