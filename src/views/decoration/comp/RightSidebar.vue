<template>
  <div class="right-side-bar">
    <el-tabs type="border-card">
      <el-tab-pane label="配置">
        <div class="property-editor">
          <el-form ref="form" :model="form" :rules="rules"
            label-width="70px">
            <el-form-item label="模块id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="模块名" prop="name">
              <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="所属模块">
              <el-input v-model="form.module" disabled></el-input>
            </el-form-item>

            <el-collapse v-model="activeNames" class="collapse">
              <el-collapse-item title="Props" name="1">
                <template v-if="form.name === 'Text'">
                  <block-text :key="form.id" :data="form" @change="onChange"></block-text>
                </template>
                <template v-if="form.name === 'Columns' && form.tag === 'el-row'">
                  <div>
                    <layout-columns :data="form" @change="onChange"></layout-columns>
                  </div>
                </template>
                <template v-if="form.name === 'Flexs'">
                  <div>
                    <layout-flexs :key="form.id" :data="form" @change="onChange"></layout-flexs>
                  </div>
                </template>
                <template v-if="form.name === 'Container'">
                    <layout-container :key="form.id" :data="form"
                      @change="onChange"></layout-container>
                </template>
                <template v-if="form.name === 'Tabs'">
                  <basic-tabs :key="form.id" :data="form" @change="onChange"></basic-tabs>
                </template>
                <template v-if="form.name === 'Carousel'">
                  <basic-carousel :key="form.id" :data="form" @change="onChange"></basic-carousel>
                </template>
                <template v-if="['Form', 'Switch'].includes(form.name)">
                  <form-index :key="form.id" :data="form" @change="onChange"></form-index>
                </template>
                <template v-if="form.name === 'Component'">
                  <component-editor :key="form.id" :data="form"
                    @change="onChange"></component-editor>
                </template>
                <template v-if="['Pagination'].includes(form.name)">
                  <common-editor :key="form.id" :data="form" @change="onChange"></common-editor>
                </template>
              </el-collapse-item>

              <el-collapse-item title="Events" name="2">
                <CommonEvent :key="form.id" :data="form" @change="onChange"></CommonEvent>
              </el-collapse-item>

            </el-collapse>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="结构">
        <render-tree></render-tree>
      </el-tab-pane>
      <el-tab-pane label="角">角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* eslint-disable */
import Messenger from '../common/messenger';
const msgr = new Messenger('#work-frame');
import { mapState, mapMutations, mapActions } from 'vuex';
import renderTree from './renderTree';
import layoutContainer from '../editor/layout/Container.vue';
import layoutColumns from '../editor/layout/Columns.vue';
import layoutFlexs from '../editor/layout/Flexs.vue';
import blockText from '../editor/block/Text.vue';
import basicTabs from '../editor/basic/Tabs.vue';
import basicCarousel from '../editor/basic/Carousel.vue';
import FormIndex from '../editor/form/Index.vue';
import ComponentEditor from '../editor/block/Component.vue';
import CommonEditor from '../editor/Common.vue';
import CommonEvent from '../editor/CommonEvent.vue';

export default {
  components: {
    // layouts
    layoutContainer,
    layoutColumns,
    layoutFlexs,
    // basic
    basicTabs,
    basicCarousel,
    // blocks
    blockText,
    //
    FormIndex,
    //
    renderTree,
    //
    ComponentEditor,
    //
    CommonEditor,
    CommonEvent,
  },
  data() {
    // const blockData = this.$store.state.editor.blockData;

    return {
      activeNames: ['2'],
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
    ...mapActions(['syncBlockData', 'syncComponentData']),
    onChange() {
      console.log(JSON.stringify(this.form));
      const data = JSON.parse(JSON.stringify(this.form));
      // this.syncComponentData(this.form);
      // console.log(data);
      // return;
      msgr.sendMessage({
        action: 'update_component_data',
        data,
      }).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });
    },
    // ignore
    onLoadBlockInfo(data) {
      // this.$refs.form.clearValidate();
      // assign to editor
      this.form = data;
      // assign to store
      // this.setBlockData(data);
      // this.setBlockData = data;
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
    window.addEventListener('message', (data) => {
      if (data.data.type === 'bridge-message') {
        this.onReceiveMessage(data.data.data);
      }
    });
    // this.$root.$on('bridge-message', this.onReceiveMessage);
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
  z-index: 20000;
  user-select: none;
  overflow-y: scroll;

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

  ::placeholder {
    color: rgb(115, 115, 115);
  }

  .collapse {
    margin: 0 -15px;
    padding: 0 15px;
  }
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    background-color: #404040;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>
