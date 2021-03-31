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

      <div>
        <el-switch
          v-if="item === Boolean || item.type === Boolean"
          v-model="form[k]"
          @change="onConfChange(k, ...arguments)"
        >
        </el-switch>
      </div>

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

      <el-button size="mini" @click="onDialogOpen(item, k)">绑定</el-button>
    </el-form-item>

    <el-dialog
      :title="`绑定 ${dialog.key}`"
      :visible.sync="dialogVisible"
      width="30%"
      @close="onDialogClose"
      >
      <el-input v-model="dialog.value" type="textarea" rows="20"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// const propertyKey = 'props';
const paginationConf = {
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
};

const confMap = {
  Textarea: {
    confKey: 'props.data.content',
    confList: {
      currentPage: {
        type: Number,
        default: 1,
      },
    },
  },
  Pagination: {
    confKey: 'props',
    confList: paginationConf,
  },
};

function restorePreviousValue(target, source, confKey, confList) {
  // restore previous conf
  // eslint-disable-next-line
    for (const k in confList) {
    const val = source[confKey] && source[confKey][k];

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
    const { confKey, confList } = confMap[this.data.name] || {};
    // used to modify comp.dataProvider
    const form = restorePreviousValue({}, this.data, confKey, confList);
    const propsBinds = this.data.propsBinds || {};

    return {
      confKey,
      confList,
      form,
      propsBinds,
      dialogVisible: false,
      dialog: {
        key: '',
        value: '',
      },
    };
  },
  methods: {
    onConfChange(k, val) {
      // eslint-disable-next-line
      // console.log(arguments);
      if (this.confList[k].type === Number || this.confList[k] === Number) {
        // eslint-disable-next-line
        val = val - 0;
      }
      if (this.confList[k].type === Array || this.confList[k] === Array) {
        try {
          // eslint-disable-next-line
          val = eval(val);
        } catch (e) {
          console.log(e);
        }
      }

      if (!this.data[this.confKey]) {
        this.data[this.confKey] = {};
      }
      if (!this.data.propsBinds) {
        this.data.propsBinds = {};
      }

      // set
      this.data[this.confKey][k] = val;
      // unset
      delete this.data.propsBinds[k];

      this.$emit('change');
    },
    onDialogOpen(item, key) {
      // item.value;
      this.dialog.value = this.propsBinds[key];
      // const s = `
      // this.dialog.value = this.propsBinds[key];
      // `;
      // eval(s);
      this.dialog.key = key;
      this.dialogVisible = true;
    },
    onDialogClose() {
      if (!this.data.propsBinds) {
        this.data.propsBinds = {};
      }
      this.propsBinds[this.dialog.key] = this.dialog.value;
      this.data.propsBinds[this.dialog.key] = this.dialog.value;
      this.$emit('change');
    },
  },
};
</script>
