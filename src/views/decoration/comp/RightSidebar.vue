<template>
  <div class="right-side-bar">
    <el-tabs type="border-card">
      <el-tab-pane label="配置">
        <div class="property-editor">
          <el-form ref="form" :model="form" :rules="rules"
            @validate="onValidate"
            label-width="80px">
            <el-form-item label="模块id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="模块名" prop="name">
              <!-- <el-select v-model="form.name" placeholder="" prop="name">
                <el-option label="List" value="List"></el-option>
                <el-option label="Text" value="Text"></el-option>
                <el-option label="Banner" value="Banner"></el-option>
                <el-option label="Footer" value="Footer"></el-option>
              </el-select> -->
              <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="所属模块">
              <el-input v-model="form.module" disabled></el-input>
            </el-form-item>
            <template v-if="form.name === 'Text'">
              <el-input type="textarea" rows="20" v-model="form.content"
                @input="onContentChange"></el-input>
            </template>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配">配置管理</el-tab-pane>
      <el-tab-pane label="角">角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    const blockData = this.$store.state.editor.blockData;

    return {
      form: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    // ...mapState({
      // blockData: (state) => state.editor.blockData,
    // }),
    blockData: {
      get () {
        return this.$store.state.editor.blockData;
      },
      set (value) {
        this.setBlockData(value);
      }
    },
    // how to use v-model with Vuex. Computed setter in action.
    // see https://itnext.io/anyway-this-is-how-to-use-v-model-with-vuex-computed-setter-in-action-320eb682c976
    content: {
      get() {
        return this.blockData.content;
      },
      set(val) {
        console.log(val);
      },
    },
  },
  methods: {
    ...mapMutations(['setBlockData']),
    ...mapActions(['syncBlockData']),
    onValidate(prop, valid, errTip) {
      if (valid) {
        // update to view
        const data = {};
        data.key = prop;
        data.value = this.form[prop];
        this.syncBlockData(data);
      } else {
        // restore to valid value
        this.$refs.form.clearValidate();
        this.form[prop] = this.blockData[prop];
      }
    },
    onContentChange() {
      this.syncBlockData({
        key: 'content',
        value: this.form.content,
      });
    },
    onLoadBlockInfo(data) {
      this.$refs.form.clearValidate();
      // assign to editor
      this.form = data;
      // assign to store
      this.setBlockData(data);
      // this.setBlockData = data;
      console.log(this.form);
    },
    onReceiveMessage(data) {
      switch (data.action) {
        case 'click_block':
          this.onLoadBlockInfo(data.data.blockInfo);
          break;
      }
    },
  },
  mounted() {
    this.$root.$on('bridge-message', this.onReceiveMessage);
  },
};
</script>

<style lang="less">
.right-side-bar {
  position: fixed;
  width: 241px;
  height: 100%;
  right: 0;
  top: 0px;
  background-color: #2b2b2b;
  border-left: 1px solid #1a1a1a;
  padding: 0;
  z-index: 16;
  user-select: none;

  color: #d9d9d9;

  .property-editor {
    word-break: break-all;
  }

  .el-input_inner {
    color: rgb(217, 217, 217);
    background: rgb(94, 94, 94);
    border-width: 1px;
    border-style: solid;
    border-color: rgb(51, 51, 51);
  }

  .el-tabs__content {
    background: #404040;
  }
}
</style>
