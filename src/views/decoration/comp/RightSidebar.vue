<template>
  <div class="right-side-bar">
    <el-tabs type="border-card">
      <el-tab-pane label="用">
        <div class="property-editor">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="模块id">
              <el-input :value="blockData.id" @input="updateMessage"></el-input>
            </el-form-item>
            <el-form-item label="模块名">
              <el-input :value="blockData.name"></el-input>
            </el-form-item>
            <el-form-item label="所属模块">
              <el-input :value="blockData.module"></el-input>
            </el-form-item>
            <template v-if="content">
              <el-input type="textarea" v-model="content"></el-input>
            </template>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配">配置管理</el-tab-pane>
      <el-tab-pane label="角">角色管理</el-tab-pane>
    </el-tabs>
          {{ JSON.stringify(blockData) }}

  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';

export default {
  data() {
    const blockData = this.$store.state.editor.blockData;

    return {
      form: {

      },
    };
  },
  computed: {
    // ...mapState({
      // blockData: (state) => state.editor.blockData,
    // }),
    blockData: {
      get () {
        return this.$store.state.editor.blockData
      },
      set (value) {
        console.log(value);
        // this.$store.commit('updateMessage', value)
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
    updateMessage(val) {
      console.log(val)
    }
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
