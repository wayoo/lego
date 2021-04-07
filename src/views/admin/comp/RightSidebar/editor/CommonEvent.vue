<template>
  <div>
    <el-form-item
      :label="item.label || k"
      :key="k"
      v-for="(item, k) in confList"
    >
      <el-button
        v-if="item.type === 'Function'"
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
const propertyKey = 'events';

function restorePreviousValue(target, source, confList) {
  // restore previous conf
  for (const k in confList) {
    const val = source[propertyKey] && source[propertyKey][k];
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
    let confList = {};
    if (this.checkConfFileExisted()) {
      confList = this.loadConfFromFile();
    }

    // const confList = confMap[this.data.name] || {};
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
    checkConfFileExisted() {
      const dirs = require.context('@/factory', true, /editor\.js$/);
      let moduleExisted = false;
      dirs.keys().forEach((item) => {
        const paths = item.split('/');
        const type = paths[1];
        const name = paths[2];

        if (type === this.data.category && name === this.data.name) {
          moduleExisted = true;
        }
      });
      return moduleExisted;
    },
    loadConfFromFile() {
      try {
        // eslint-disable-next-line
        const conf = require(`@/factory/${this.data.category}/${this.data.name}/editor.js`);
        return conf.default.events;
      } catch (e) {
        console.log(e);
      }
      return false;
    },
    /**
     * communication
     */
    onDialogOpen(item, key) {
      // item.value;
      this.dialog.content = this.form[key] || item.value;
      this.dialog.key = key;
      this.dialogVisible = true;
    },
    onDialogClose() {
      console.log(this.dialog.content);
      this.data[propertyKey] = this.data[propertyKey] || {};
      this.data[propertyKey][this.dialog.key] = this.dialog.content;
      this.form[this.dialog.key] = this.dialog.content;
      this.$emit('change');
    },
  },
};
</script>
