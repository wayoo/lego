<template>
  <div>
    <el-form-item
      :label="item.label || k"
      :key="k"
      v-for="(item, k) in confList"
    >
      <el-button
        v-if="item.type === 'JSON'"
        @click="onDialogOpen(item, k)"
      >编辑</el-button>

      <el-button
        v-if="item.type === 'Expression'"
        @click="onDialogOpen(item, k)"
      >绑定</el-button>
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
let propertyKey;

const confMap = {
  Component: {
    // eslint-disable-next-line quote-props
    '模板数据': {
      type: 'JSON',
    },
  },
  default: {
    'v-model': {
      type: 'Expression',
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
    if (this.data.name === 'Component') {
      propertyKey = 'tmplData';
    } else {
      propertyKey = 'vModelBind';
    }
    const confList = confMap[this.data.name] || confMap.default;
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
    onDialogOpen(item, key) {
      if (propertyKey === 'tmplData') {
        this.dialog.content = JSON.stringify(this.data[propertyKey], null, 4);
      } else {
        this.dialog.content = this.data[propertyKey];
      }
      // item.value;
      this.dialog.key = key;
      this.dialogVisible = true;
    },
    onDialogClose() {
      console.log(this.dialog.content);
      this.data[propertyKey] = this.data[propertyKey] || {};
      // this.data[propertyKey][this.dialog.key] = this.dialog.content;
      this.form[this.dialog.key] = this.dialog.content;
      if (propertyKey === 'tmplData') {
        this.saveJSON();
      } else {
        this.saveValue();
      }
    },
    saveJSON() {
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
    saveValue() {
      this.data[propertyKey] = this.dialog.content;
      this.$emit('change');
    },
  },
};
</script>
