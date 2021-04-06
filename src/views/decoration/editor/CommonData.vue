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

      <el-button
        v-if="item.type === 'JSON'"
        @click="onDialogOpen(item, k)"
      >编辑</el-button>

      <!-- <el-input type="textarea" rows="4"
        v-model="form[k]"
        @change="onConfChange(k, form[k])"></el-input> -->
    </el-form-item>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="30%"
      @close="onDialogClose"
      >
      <el-input v-model="dialog.content" type="textarea" rows="20"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const propertyKey = 'tmplData';

const confMap = {
  Component: {
    // eslint-disable-next-line quote-props
    '模板数据': {
      type: 'JSON',
    },
  },
};

function restorePreviousValue(target, source, confList) {
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
    const confList = confMap[this.data.name] || {};
    // used to modify comp.dataProvider
    const form = restorePreviousValue({}, this.data, confList);

    return {
      confList,
      form,
      dialogVisible: false,
      dialog: {
        isShow: false,
        content: '',
      },
    };
  },
  methods: {
    onConfChange(k, val) {
      const { confList } = this;
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
    onDialogOpen(item, key) {
      // item.value;
      this.dialog.content = JSON.stringify(this.data[propertyKey], null, 4);
      this.dialog.key = key;
      this.dialogVisible = true;
    },
    onDialogClose() {
      console.log(this.dialog.content);
      this.data[propertyKey] = this.data[propertyKey] || {};
      // this.data[propertyKey][this.dialog.key] = this.dialog.content;
      this.form[this.dialog.key] = this.dialog.content;
      const tmplData = {};
      try {
        // eslint-disable-next-line no-eval
        eval(`tmplData = ${this.dialog.content}`);
      // eslint-disable-next-line no-empty
      } catch (e) {
        console.log(e);
      }
      this.data[propertyKey] = tmplData;
      this.data.key = new Date() - 0;
      this.$emit('change');
    },
  },
};
</script>
