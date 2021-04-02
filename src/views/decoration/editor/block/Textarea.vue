<template>
  <div>
      <el-button class="btn" size="mini"
        :plain="true"
        :type="propsBinds[k] ? 'primary' : ''"
        @click="onDialogOpen(item, k)">{{ propsBinds[k] ? '已绑定' : '绑定' }}</el-button>
      <el-input type="textarea" rows="20" v-model="form.content"
        @input="onContentChange"></el-input>

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
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    console.log(this.data);
    const propsBinds = this.data.propsBinds || {};

    return {
      form: {
        content: this.data.props.data.content,
      },
      propsBinds,
      // hack
      item: '',
      k: 'data.content',
      // hack
      dialogVisible: false,
      dialog: {
        key: '',
        value: '',
      },
    };
  },
  methods: {
    onContentChange(val) {
      this.data.props.data.content = val;
      this.$emit('change');
    },
    onDialogOpen(item, key) {
      // item.value;
      this.dialog.value = this.propsBinds[key];
      console.log(this.propsBinds);
      this.dialog.key = key;
      this.dialogVisible = true;
    },
    onDialogClose() {
      if (!this.data.propsBinds) {
        this.data.propsBinds = {};
      }
      // save to current model
      this.$set(this.propsBinds, this.dialog.key, this.dialog.value);
      // save to data model
      this.data.propsBinds[this.dialog.key] = this.dialog.value;
      this.$emit('change');
    },
  },
};
</script>

<style lang="less" scoped>
.btn {
  margin-bottom: 10px;
}
</style>
