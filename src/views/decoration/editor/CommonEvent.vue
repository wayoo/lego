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

const confMap = {
  Pagination: {
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
    // onConfChange(k, val) {
    //   // eslint-disable-next-line
    //   // console.log(arguments);
    //   if (confList[k].type === Number || confList[k] === Number) {
    //     // eslint-disable-next-line
    //     val = val - 0;
    //   }
    //   if (confList[k].type === Array || confList[k] === Array) {
    //     try {
    //       // eslint-disable-next-line
    //       val = eval(val);
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }

    //   if (!this.data[propertyKey]) {
    //     this.data[propertyKey] = {};
    //   }

    //   this.data[propertyKey][k] = val;
    //   this.$emit('change');
    // },
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
